import React, { useState } from "react";
import { Mode } from "../SpeedDial";
import { Marker as MarkerType } from "@/types/Notes";

/**
 * `Marker`の引数
 */
interface Props {
  params: MarkerType;
  mode: Mode;
  pageRect: DOMRect;
  onDelete: () => void;
}

/**
 * 黄色いマーカー
 */
const Marker: React.FC<Props> = ({ params, mode, pageRect, onDelete }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <line
      x1={params.x1 * pageRect.width}
      y1={params.y1 * pageRect.height}
      x2={params.x2 * pageRect.width}
      y2={params.y2 * pageRect.height}
      style={{
        stroke: "yellow",
        opacity: hover ? 0.2 : 0.5,
        strokeWidth: "8",
        cursor: cursor,
      }}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
        if (mode === "delete") onDelete();
        if (mode === "move") {
          // TODO
        }
      }}
      onMouseEnter={() => {
        setHover(!!cursor);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    />
  );
};

export default Marker;
