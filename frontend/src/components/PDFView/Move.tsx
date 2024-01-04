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
const getTranslated = (params: NoteType, dx: number, dy: number) => {
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
const getTransformed = (params: Node, dx: number, dy: number) => {
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
 * `Move`の引数
 */
interface Props {
  params?: NoteType | Node;
  mouse: { pageX: number; pageY: number };
  pageRect?: DOMRect;
  onClose: (newNote?: NoteType, oldNote?: NoteType) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Move: FC<Props> = ({ params, mouse, pageRect, onClose }) => {
  const [pageXY, setPageXY] = useState<typeof mouse>();
  const ref = useRef<HTMLElement>();
  if (!params || !pageRect) return <></>;

  const getDxy = (xy: typeof mouse) =>
    [
      (xy.pageX - mouse.pageX) / pageRect.width,
      (xy.pageY - mouse.pageY) / pageRect.height,
    ] as const;

  const [dx, dy] = getDxy(pageXY ?? mouse);
  const newParams =
    params.type === "Node" ? getTransformed(params, dx, dy) : params;

  const getSvg = () => {
    switch (newParams.type) {
      case "Arrow":
        return <Arrow pageRect={pageRect} params={newParams} />;
      case "Bracket":
        return <Bracket pageRect={pageRect} params={newParams} />;
      case "Marker":
        return <Marker pageRect={pageRect} params={newParams} />;
      case "Polygon":
        return <Polygon pageRect={pageRect} params={newParams} />;
      case "Rect":
        return <Rect pageRect={pageRect} params={newParams} />;
    }
    return undefined;
  };
  const getHtml = () => {
    switch (newParams.type) {
      case "Chip":
        return <Chip params={newParams} />;
      case "Note":
        return <Note params={newParams} />;
      case "PageLink":
        return <PageLink params={newParams} />;
    }
    return undefined;
  };

  const handleClose = (xy: typeof mouse) => {
    const [dx, dy] = getDxy(xy);
    if (params.type === "Node") {
      onClose(params.target, getTransformed(params, dx, dy));
    } else {
      onClose(params, getTranslated(params, dx, dy));
    }
  };

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
        <Svg pageRect={pageRect}>{getSvg()}</Svg>
        {getHtml()}
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
          setPageXY(undefined);
          handleClose({ pageX: e.pageX, pageY: e.pageY });
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseLeave={() => {
          setPageXY(undefined);
          onClose();
        }}
        onMouseMove={(e) => {
          if (params.type === "Node") {
            setPageXY({ pageX: e.pageX, pageY: e.pageY });
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
