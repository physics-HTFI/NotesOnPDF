import { MouseEvent, useState } from "react";
import { Mode } from "../SpeedDial";
import {
  Marker as MarkerType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import Node from "./Node";
import useCursor from "./utils/useCursor";

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
  const [hover, setHover] = useState(false);
  const { cursor, isMove } = useCursor(mode, true);
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
        style={{ cursor, mixBlendMode: "multiply" }}
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
        {/* マーカー本体 */}
        <line
          {...xy}
          style={{
            stroke: hover ? "#fe7" : "#ff7",
            strokeWidth: "8",
          }}
        />
      </g>
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
    </>
  );
}
