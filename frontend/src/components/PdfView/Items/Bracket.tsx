import { MouseEvent, useState } from "react";
import {
  Bracket as BracketParams,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import { Mode } from "../SpeedDial";
import Node from "./Node";
import useCursor from "./useCursor";

/**
 * 括弧
 */
export default function Bracket({
  params,
  mode,
  pageRect,
  onMouseDown,
  disableNodes,
}: {
  params: BracketParams;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
  disableNodes?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const { getCursor, isMove } = useCursor(mode);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
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
      <g
        style={{ cursor }}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={() => {
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        {/* 編集時につかみやすくする */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{
            stroke: "transparent",
            strokeWidth: "30",
          }}
        />
        {/* 背景と混ざらないようにするための白枠 */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{
            stroke: "white",
            opacity: 0.7,
            strokeWidth: "5",
          }}
        />
        {/* 括弧本体 */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{
            stroke: "red",
            strokeWidth: "1",
            opacity: hover ? 0.5 : 1,
            markerStart: params.heads.includes("start")
              ? "url(#bracket)"
              : undefined,
            markerEnd: params.heads.includes("end")
              ? "url(#bracket)"
              : undefined,
          }}
        />
      </g>
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
    </>
  );
}
