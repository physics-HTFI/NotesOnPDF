import { MouseEvent, useState } from "react";
import {
  Bracket as BracketParams,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import { Mode } from "../SpeedDial";
import Node from "./Node";
import useCursor from "./utils/useCursor";

/**
 * 括弧
 */
export default function Bracket({
  params,
  mode,
  pageRect,
  onMouseDown,
}: {
  params: BracketParams;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}) {
  const [hover, setHover] = useState(false);
  const { cursor, isMove } = useCursor(mode);
  const xy = {
    x1: params.x1 * pageRect.width,
    y1: params.y1 * pageRect.height,
    x2: params.x2 * pageRect.width,
    y2: params.y2 * pageRect.height,
  };
  const node = isMove
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
          {...xy}
          style={{
            stroke: "transparent",
            strokeWidth: "30",
          }}
        />
        {/* 背景と混ざらないようにするための白枠 */}
        <line
          {...xy}
          style={{
            stroke: "white",
            opacity: 0.7,
            strokeWidth: "5",
          }}
        />
        {/* 括弧本体 */}
        <line
          {...xy}
          style={{
            stroke: "red",
            strokeWidth: "1",
            opacity: hover ? 0.5 : 1,
            markerStart:
              params.style === "normal" || params.style === "start"
                ? "url(#bracket)"
                : undefined,
            markerEnd:
              params.style === "normal" || params.style === "end"
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
