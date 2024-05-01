import { FC, MouseEvent, useState } from "react";
import { Mode } from "../SpeedDial";
import { Rect as RectType, Node as NodeType, NoteType } from "@/types/PdfNotes";
import Node from "./Node";
import { useCursor } from "./useCursor";

/**
 * `Rect`の引数
 */
interface Props {
  params: RectType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
  disableNodes?: boolean;
}

/**
 * 長方形
 */
const Rect: FC<Props> = ({
  params,
  mode,
  pageRect,
  onMouseDown,
  disableNodes,
}) => {
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

  return (
    <>
      <rect
        x={params.x * pageRect.width}
        y={params.y * pageRect.height}
        width={params.width * pageRect.width}
        height={params.height * pageRect.height}
        style={{
          fill: "red",
          stroke: params.style === "outlined" ? "red" : "none",
          fillOpacity: params.style === "outlined" ? 0 : hover ? 0.2 : 0.3,
          strokeOpacity: hover ? 0.5 : 1,
          cursor,
          mixBlendMode: "multiply",
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
};

export default Rect;
