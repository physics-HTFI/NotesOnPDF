import { MouseEvent, useState } from "react";
import {
  Arrow,
  Bracket,
  Marker,
  Node as NodeType,
  NoteType,
  Polygon,
  Rect,
} from "@/types/PdfNotes";
import { green } from "@mui/material/colors";

export interface NodeProps {
  target: Arrow | Bracket | Marker | Polygon | Rect;
  index: number;
  visible: boolean;
  pageRect: DOMRect;
  isGrab: boolean;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}

/**
 * ノード編集用マーカー
 */
export default function Node({
  target,
  index,
  visible,
  pageRect,
  isGrab,
  onMouseDown,
}: NodeProps) {
  const [hover, setHover] = useState(false);
  const [x, y] = (() => {
    switch (target.type) {
      case "Arrow":
      case "Bracket":
      case "Marker":
        return index === 0 ? [target.x1, target.y1] : [target.x2, target.y2];
      case "Polygon":
        return target.points[index] ?? [0, 0];
      case "Rect":
        return [
          target.x + (index % 2 === 0 ? 0 : target.width),
          target.y + (index / 2 < 1 ? 0 : target.height),
        ];
    }
  })();
  return (
    <g
      style={{
        fill: visible || hover ? green.A700 : "transparent",
        cursor: isGrab ? "grab" : "alias",
      }}
      onMouseDown={(e) => {
        onMouseDown?.(e, { type: "Node", target, index });
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <circle cx={x * pageRect.width} cy={y * pageRect.height} r="3" />
      <circle
        cx={x * pageRect.width}
        cy={y * pageRect.height}
        r="10"
        style={{ fill: hover ? undefined : "transparent" }}
      />
    </g>
  );
}
