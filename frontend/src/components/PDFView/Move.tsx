import { FC, useRef, useState } from "react";
import Arrow from "./Overlay/Arrow";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Note from "./Overlay/Note";
import PageLink from "./Overlay/PageLink";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";
import Svg from "./Overlay/Svg";
import Chip from "./Overlay/Chip";
import { Node, NoteType } from "@/types/Notes";
import { Box } from "@mui/material";

/**
 * 平行移動した注釈を返す
 */
const getTranslated = (params: NoteType, dxy: [number, number]) => {
  const [dx, dy] = dxy;
  const newParams: NoteType = { ...params };
  switch (newParams.type) {
    case "Chip":
    case "Note":
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
};

/**
 * 変形した注釈を返す
 */
const getTransformed = (params: Node, dxy: [number, number]) => {
  const [dx, dy] = dxy;
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
};

/**
 * 「不正な座標の場合の更新拒否」と「座標のスナップ」
 */
const getValidatedXY = (
  params: Node,
  dxy: [number, number],
  pageRect: DOMRect
): [number, number] | undefined => {
  const t = getTransformed(params, dxy);
  const width = (dx: number) => pageRect.width * Math.abs(dx);
  const height = (dy: number) => pageRect.height * Math.abs(dy);
  switch (t.type) {
    case "Arrow":
      if (width(t.x2 - t.x1) < 5 && height(t.y2 - t.y1) < 5) return undefined;
      return dxy;
    case "Bracket": {
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
    }
    case "Marker":
      if (width(t.x2 - t.x1) < 20) return undefined;
      return [dxy[0], 0];
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
};

/**
 * `Move`の引数
 */
interface Props {
  params?: NoteType | Node;
  mouse: { pageX: number; pageY: number };
  pageRect?: DOMRect;
  onClose: (newNote?: NoteType, oldNote?: NoteType) => void;
}

/**
 * 移動中の注釈を表示するコンポーネント
 */
const Move: FC<Props> = ({ params, mouse, pageRect, onClose }) => {
  const [dXY, setDXY] = useState<[number, number]>([0, 0]);
  const ref = useRef<HTMLElement>();
  if (!params || !pageRect) return <></>;

  const getDxy = (xy?: typeof mouse): [number, number] =>
    !xy
      ? [0, 0]
      : [
          (xy.pageX - mouse.pageX) / pageRect.width,
          (xy.pageY - mouse.pageY) / pageRect.height,
        ];

  const newParams =
    params.type === "Node" ? getTransformed(params, dXY) : params;

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
        {newParams.type === "Note" && <Note params={newParams} />}
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
          cursor: params.type === "Node" ? "none" : "move",
        }}
        onMouseUp={(e) => {
          setDXY([0, 0]);
          e.preventDefault();
          e.stopPropagation();
          const δxy =
            params.type === "Node"
              ? dXY
              : getDxy({ pageX: e.pageX, pageY: e.pageY });
          if (δxy[0] === 0 && δxy[1] === 0) {
            onClose();
          } else if (params.type === "Node") {
            onClose(params.target, getTransformed(params, δxy));
          } else {
            onClose(params, getTranslated(params, δxy));
          }
        }}
        onMouseLeave={() => {
          setDXY([0, 0]);
          onClose();
        }}
        onMouseMove={(e) => {
          if (params.type === "Node") {
            const δxy = getValidatedXY(
              params,
              getDxy({ pageX: e.pageX, pageY: e.pageY }),
              pageRect
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
      />
    </>
  );
};

export default Move;
