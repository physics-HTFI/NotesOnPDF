import { useContext, useRef, useState } from "react";
import Arrow from "./Items/Arrow";
import Bracket from "./Items/Bracket";
import Marker from "./Items/Marker";
import Memo from "./Items/Memo";
import PageLink from "./Items/PageLink";
import Rect from "./Items/Rect";
import Polygon from "./Items/Polygon";
import Svg from "./Items/Svg";
import Chip from "./Items/Chip";
import { Node, NoteType } from "@/types/PdfNotes";
import { Box } from "@mui/material";
import MouseContext from "@/contexts/MouseContext";
import usePdfNotes from "@/hooks/usePdfNotes";
import ModelContext from "@/contexts/ModelContext";

/**
 * 移動中の注釈を表示するコンポーネント
 */
export default function Move({
  params,
  onClose,
}: {
  params?: NoteType | Node;
  onClose: (
    newNote?: NoteType,
    oldNote?: NoteType,
    addPolygon?: boolean
  ) => void;
}) {
  const [dXY, setDXY] = useState<[number, number]>();
  const ref = useRef<HTMLElement>();
  const { mouse, setMouse, pageRect } = useContext(MouseContext);
  const { appSettings } = useContext(ModelContext);
  const { page } = usePdfNotes();
  if (!params || !mouse || !pageRect || !appSettings) {
    if (dXY) setDXY(undefined); // 頂点編集中に`Esc`を押してキャンセル後に値が残るのを防ぐ
    return <></>;
  }

  const getDxy = (xy?: typeof mouse): [number, number] =>
    !xy
      ? [0, 0]
      : [
          (xy.pageX - mouse.pageX) / pageRect.width,
          (xy.pageY - mouse.pageY) / pageRect.height,
        ];

  const newParams =
    params.type === "Node" ? getTransformed(params, dXY) : params;
  const addingPolygon =
    params.type === "Node" &&
    newParams.type === "Polygon" &&
    !page?.notes?.includes(params.target);
  if (addingPolygon) newParams.style = "outlined";

  return (
    <>
      {/* ページと同じサイズを持つBox */}
      <Box
        ref={ref}
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Svg pageRect={pageRect}>
          {newParams.type === "Arrow" && (
            <Arrow pageRect={pageRect} params={newParams} />
          )}
          {newParams.type === "Bracket" && (
            <Bracket pageRect={pageRect} params={newParams} />
          )}
          {newParams.type === "Marker" && (
            <Marker pageRect={pageRect} params={newParams} />
          )}
          {newParams.type === "Polygon" && (
            <Polygon pageRect={pageRect} params={newParams} />
          )}
          {newParams.type === "Rect" && (
            <Rect pageRect={pageRect} params={newParams} />
          )}
        </Svg>
        {newParams.type === "Chip" && <Chip params={newParams} />}
        {newParams.type === "Memo" && <Memo params={newParams} />}
        {newParams.type === "PageLink" && <PageLink params={newParams} />}
      </Box>

      {/* 右ペイン全体を覆うBox。領域外に出たかの判定用。 */}
      <Box
        sx={{
          position: "absolute",
          left: -window.screen.width,
          top: -window.screen.height,
          width: 2 * window.screen.width,
          height: 2 * window.screen.height,
          cursor: newParams.type === "Marker" ? "default" : "none",
        }}
        onMouseUp={(e) => {
          setDXY(undefined);
          e.stopPropagation();
          setMouse({ pageX: e.pageX, pageY: e.pageY });
          const δxy =
            params.type === "Node"
              ? dXY ?? [0, 0]
              : getDxy({ pageX: e.pageX, pageY: e.pageY });
          const noMove = δxy[0] === 0 && δxy[1] === 0;
          const isPolygonNode =
            params.type === "Node" && params.target.type === "Polygon";

          if (noMove && !isPolygonNode) {
            onClose();
          } else if (params.type === "Node") {
            if (noMove && params.target.type === "Polygon" && addingPolygon) {
              params.target.points.pop(); // ポリゴンの追加時は最後の点が重複しているので消す
              if (params.target.points.length <= 2) {
                onClose();
                return;
              }
            }
            onClose(
              params.target,
              getTransformed(params, δxy),
              noMove && isPolygonNode
            );
          } else {
            onClose(params, getTranslated(params, δxy));
          }
        }}
        onMouseLeave={() => {
          setDXY(undefined);
          onClose();
        }}
        onMouseMove={(e) => {
          if (params.type === "Node") {
            const δxy = getValidatedXY(
              params,
              getDxy({ pageX: e.pageX, pageY: e.pageY }),
              pageRect,
              appSettings.snapNotes
            );
            if (!δxy) return;
            setDXY(δxy);
          } else {
            const box = ref.current;
            if (!box) return;
            box.style.left = `${e.pageX - mouse.pageX}px`;
            box.style.top = `${e.pageY - mouse.pageY}px`;
          }
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      />
    </>
  );
}

//|
//| ローカル関数
//|

/**
 * 平行移動した注釈を返す
 */
function getTranslated(params: NoteType, dxy?: [number, number]) {
  const [dx, dy] = dxy ?? [0, 0];
  const newParams: NoteType = { ...params };
  switch (newParams.type) {
    case "Chip":
    case "Memo":
    case "PageLink":
      newParams.x += dx;
      newParams.y += dy;
      break;
    case "Arrow":
    case "Bracket":
    case "Marker":
      newParams.x1 += dx;
      newParams.y1 += dy;
      newParams.x2 += dx;
      newParams.y2 += dy;
      break;
    case "Rect":
      newParams.x += dx;
      newParams.y += dy;
      break;
    case "Polygon":
      newParams.points = newParams.points.map((p) => [p[0] + dx, p[1] + dy]);
      break;
  }
  return newParams;
}

/**
 * 変形した注釈を返す
 */
function getTransformed(params: Node, dxy?: [number, number]) {
  const [dx, dy] = dxy ?? [0, 0];
  const newParams: NoteType = { ...params.target };
  switch (newParams.type) {
    case "Arrow":
    case "Bracket":
    case "Marker":
      if (params.index === 0) {
        newParams.x1 += dx;
        newParams.y1 += dy;
      } else {
        newParams.x2 += dx;
        newParams.y2 += dy;
      }
      break;
    case "Rect":
      // 上から順に 左、右、上、下
      if ([0, 2].includes(params.index)) {
        newParams.x += dx;
        newParams.width -= dx;
      }
      if ([1, 3].includes(params.index)) {
        newParams.width += dx;
      }
      if ([0, 1].includes(params.index)) {
        newParams.y += dy;
        newParams.height -= dy;
      }
      if ([2, 3].includes(params.index)) {
        newParams.height += dy;
      }
      if (newParams.width < 0) {
        newParams.width *= -1;
        newParams.x -= newParams.width;
      }
      if (newParams.height < 0) {
        newParams.height *= -1;
        newParams.y -= newParams.height;
      }
      break;
    case "Polygon":
      newParams.points = newParams.points.map((p, i) => [
        p[0] + (i === params.index ? dx : 0),
        p[1] + (i === params.index ? dy : 0),
      ]);
      break;
  }
  return newParams;
}

/**
 * 「不正な座標の場合の更新拒否」と「座標のスナップ」
 */
function getValidatedXY(
  params: Node,
  dxy: [number, number],
  pageRect: DOMRect,
  snap: boolean
): [number, number] | undefined {
  const t = getTransformed(params, dxy);
  const width = (dx: number) => pageRect.width * Math.abs(dx);
  const height = (dy: number) => pageRect.height * Math.abs(dy);
  switch (t.type) {
    case "Arrow":
      if (width(t.x2 - t.x1) < 5 && height(t.y2 - t.y1) < 5) return undefined;
      return dxy;
    case "Bracket":
      if (snap) {
        const isX = width(t.x2 - t.x1) > height(t.y2 - t.y1);
        const t0 = params.target;
        if (t0.type !== "Bracket") return undefined;
        if (isX) {
          if (width(t.x2 - t.x1) < 10) return undefined;
          return [dxy[0], (params.index === 0 ? 1 : -1) * (t0.y2 - t0.y1)];
        } else {
          if (height(t.y2 - t.y1) < 10) return undefined;
          return [(params.index === 0 ? 1 : -1) * (t0.x2 - t0.x1), dxy[1]];
        }
      } else {
        if (width(t.x2 - t.x1) < 10 && width(t.y2 - t.y1) < 10)
          return undefined;
        return dxy;
      }
    case "Marker":
      if (snap) {
        const t0 = params.target;
        if (t0.type !== "Marker") return undefined;
        if (width(t.x2 - t.x1) < 20) return undefined;
        return [dxy[0], (params.index === 0 ? 1 : -1) * (t0.y2 - t0.y1)];
      } else {
        if (width(t.x2 - t.x1) < 20 && width(t.y2 - t.y1) < 20)
          return undefined;
        return dxy;
      }
    case "Polygon": {
      const P = t.points[params.index] ?? [0, 0];
      if (
        t.points.some(
          (p) => p !== P && width(P[0] - p[0]) < 5 && height(P[1] - p[1]) < 5
        )
      )
        return undefined;
      return dxy;
    }
    case "Rect":
      if (width(t.width) < 3 || height(t.height) < 3) return undefined;
      return dxy;
  }
}
