import { MouseEvent } from "react";
import { Mode } from "../SpeedDial";
import { Rect as RectType, Node as NodeType, NoteType } from "@/types/PdfNotes";
import getPolygonStyle from "./utils/getPolygonStyle";
import Nodes from "./Node";
import useCursor from "./utils/useCursor";

/**
 * 長方形
 */
export default function Rect({
  params,
  mode,
  moving,
  pageRect,
  onMouseDown,
}: {
  params: RectType;
  mode?: Mode;
  moving?: boolean;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}) {
  const { cursor, hover, onMouseEnter, onMouseLeave } = useCursor(mode);

  return (
    <>
      <rect
        x={params.x * pageRect.width}
        y={params.y * pageRect.height}
        width={params.width * pageRect.width}
        height={params.height * pageRect.height}
        style={getPolygonStyle(params, hover, cursor, moving)}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      <Nodes
        target={params}
        mode={mode}
        visible={hover}
        pageRect={pageRect}
        onMouseDown={onMouseDown}
      />
    </>
  );
}
