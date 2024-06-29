import { MouseEvent } from "react";
import { Mode } from "../SpeedDial";
import {
  Marker as MarkerType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import useCursor from "./utils/useCursor";
import Nodes from "./Node";

/**
 * 黄色いマーカー
 */
export default function Marker({
  params,
  mode,
  pageRect,
  onMouseDown,
}: {
  params: MarkerType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}) {
  const { cursor, hover, onMouseEnter, onMouseLeave } = useCursor(mode, true);
  const xy = {
    x1: params.x1 * pageRect.width,
    y1: params.y1 * pageRect.height,
    x2: params.x2 * pageRect.width,
    y2: params.y2 * pageRect.height,
  };

  return (
    <>
      <g
        style={{ cursor, mixBlendMode: "multiply" }}
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
        {/* マーカー本体 */}
        <line
          {...xy}
          style={{
            stroke: "#ff7",
            strokeWidth: "8",
            filter: hover ? "invert(0.1)" : undefined,
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
