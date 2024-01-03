import { FC, useRef } from "react";
import Arrow from "./Overlay/Arrow";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Note from "./Overlay/Note";
import PageLink from "./Overlay/PageLink";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";
import Svg from "./Overlay/Svg";
import Chip from "./Overlay/Chip";
import { NoteType } from "@/types/Notes";
import { Box } from "@mui/material";

/**
 * `Move`の引数
 */
interface Props {
  params?: NoteType;
  mouse: { pageX: number; pageY: number };
  pageRect?: DOMRect;
  onClose: (note?: NoteType) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Move: FC<Props> = ({ params, mouse, pageRect, onClose }) => {
  const ref = useRef<HTMLElement>();
  if (!params || !pageRect) return <></>;

  const getSvg = () => {
    switch (params.type) {
      case "Arrow":
        return <Arrow pageRect={pageRect} params={params} />;
      case "Bracket":
        return <Bracket pageRect={pageRect} params={params} />;
      case "Marker":
        return <Marker pageRect={pageRect} params={params} />;
      case "Polygon":
        return <Polygon pageRect={pageRect} params={params} />;
      case "Rect":
        return <Rect pageRect={pageRect} params={params} />;
    }
    return undefined;
  };
  const getHtml = () => {
    switch (params.type) {
      case "Chip":
        return <Chip params={params} />;
      case "Note":
        return <Note params={params} />;
      case "PageLink":
        return <PageLink params={params} />;
    }
    return undefined;
  };

  const handleClose = (xy?: typeof mouse) => {
    if (!xy) {
      onClose();
      return;
    }
    const [dx, dy] = [
      (xy.pageX - mouse.pageX) / pageRect.width,
      (xy.pageY - mouse.pageY) / pageRect.height,
    ];
    const newParams = { ...params };
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
      case "Rect":
        newParams.x1 += dx;
        newParams.y1 += dy;
        newParams.x2 += dx;
        newParams.y2 += dy;
        break;
      case "Polygon":
        newParams.points = newParams.points.map((p) => [p[0] + dx, p[1] + dy]);
        break;
    }
    onClose(newParams);
  };

  return (
    <>
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
      <Box
        sx={{
          position: "absolute",
          left: -window.screen.width,
          top: -window.screen.height,
          width: 2 * window.screen.width,
          height: 2 * window.screen.height,
          cursor: "move",
        }}
        onMouseUp={(e) => {
          handleClose({ pageX: e.pageX, pageY: e.pageY });
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseLeave={() => {
          handleClose();
        }}
        onMouseMove={(e) => {
          const box = ref.current;
          if (!box) return;
          box.style.left = `${e.pageX - mouse.pageX}px`;
          box.style.top = `${e.pageY - mouse.pageY}px`;
        }}
      />
    </>
  );
};

export default Move;
