import { MouseEvent, useState } from "react";
import { Mode } from "../SpeedDial";
import { Rect as RectType, Node as NodeType, NoteType } from "@/types/PdfNotes";
import Node from "./Node";
import useCursor from "./useCursor";

/**
 * 長方形
 */
export default function Rect({
  params,
  mode,
  moving,
  pageRect,
  onMouseDown,
  disableNodes,
}: {
  params: RectType;
  mode?: Mode;
  moving?: boolean;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
  disableNodes?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const { getCursor, isMove } = useCursor(mode);
  const cursor = disableNodes ? undefined : getCursor();
  const node =
    !disableNodes && isMove
      ? {
          target: params,
          visible: hover,
          pageRect,
          onMouseDown,
          isGrab: mode === "move",
        }
      : undefined;
  const isColorize = params.style === "colorize" && !hover && !moving;

  return (
    <>
      <rect
        x={params.x * pageRect.width}
        y={params.y * pageRect.height}
        width={params.width * pageRect.width}
        height={params.height * pageRect.height}
        style={{
          fill: isColorize ? "red" : "#fbb",
          stroke: params.style === "outlined" ? "red" : "none",
          fillOpacity: params.style === "outlined" ? 0 : hover ? 0.7 : 1.0,
          strokeOpacity: hover ? 0.5 : 1,
          cursor,
          mixBlendMode: isColorize ? "lighten" : "multiply",
        }}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={() => {
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
      {node && <Node index={2} {...node} />}
      {node && <Node index={3} {...node} />}
    </>
  );
}
