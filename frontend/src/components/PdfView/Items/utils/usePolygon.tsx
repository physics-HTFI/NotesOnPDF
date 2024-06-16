import { CSSProperties, MouseEvent, useState } from "react";
import {
  Rect as RectType,
  Node as NodeType,
  NoteType,
  Polygon as PolygonType,
} from "@/types/PdfNotes";
import { Mode } from "../../SpeedDial";
import useCursor from "./useCursor";
import { NodeProps } from "../Node";

export default function usePolygon(
  params: PolygonType | RectType,
  pageRect: DOMRect,
  mode?: Mode,
  moving?: boolean,
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void
) {
  const [hover, setHover] = useState(false);
  const { cursor, isMove } = useCursor(mode);
  const node: Omit<NodeProps, "index"> | undefined = isMove
    ? {
        target: params,
        visible: hover,
        pageRect,
        onMouseDown,
        isGrab: mode === "move",
      }
    : undefined;
  const isColorize = params.style === "colorize" && !hover && !moving;
  const style: CSSProperties = {
    fill: isColorize ? "red" : "#fbb",
    stroke: params.style === "outlined" ? "red" : "none",
    fillOpacity: params.style === "outlined" ? 0 : hover ? 0.7 : 1.0,
    strokeOpacity: hover ? 0.5 : 1,
    cursor,
    mixBlendMode: isColorize ? "lighten" : "multiply",
  };

  return {
    node,
    style,
    onMouseEnter: () => {
      setHover(!!cursor);
    },
    onMouseLeave: () => {
      setHover(false);
    },
  };
}
