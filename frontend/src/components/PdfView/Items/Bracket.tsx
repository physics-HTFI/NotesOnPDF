import { MouseEvent } from "react";
import {
  Bracket as BracketParams,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import { Mode } from "../SpeedDial";
import useCursor from "./utils/useCursor";
import Nodes from "./Node";

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
  const { cursor, hover, onMouseEnter, onMouseLeave } = useCursor(mode);
  const xy = {
    x1: params.x1 * pageRect.width,
    y1: params.y1 * pageRect.height,
    x2: params.x2 * pageRect.width,
    y2: params.y2 * pageRect.height,
  };

  return (
    <>
      <g
        style={{ cursor }}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
