import { MouseEvent } from "react";
import { Mode } from "../SpeedDial";
import { Rect as RectType, Node as NodeType, NoteType } from "@/types/PdfNotes";
import Node from "./Node";
import usePolygon from "./utils/usePolygon";

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
  const { node, style, onMouseEnter, onMouseLeave } = usePolygon(
    params,
    pageRect,
    mode,
    moving,
    onMouseDown
  );

  return (
    <>
      <rect
        x={params.x * pageRect.width}
        y={params.y * pageRect.height}
        width={params.width * pageRect.width}
        height={params.height * pageRect.height}
        style={style}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
      {node && <Node index={2} {...node} />}
      {node && <Node index={3} {...node} />}
    </>
  );
}
