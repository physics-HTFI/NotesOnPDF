import React, { useState } from "react";
import { Mode } from "../Control";
import { Rect as RectType } from "@/types/Notes";

/**
 * `Rect`の引数
 */
interface Props {
  params: RectType;
  mode: Mode;
  pageRect: DOMRect;
  onDelete: () => void;
}

/**
 * 長方形
 */
const Rect: React.FC<Props> = ({ params, mode, pageRect, onDelete }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <rect
      x={params.x * pageRect.width}
      y={params.y * pageRect.height}
      width={params.width * pageRect.width}
      height={params.height * pageRect.height}
      style={{
        fill: "red",
        stroke: params.border ? "red" : "none",
        fillOpacity: params.border ? 0 : hover ? 0.2 : 0.3,
        strokeOpacity: hover ? 0.5 : 1,
        cursor: cursor,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.button === 0) {
          if (mode === "delete") onDelete();
          else if (mode === "edit") {
            // TODO
          } else if (mode === "move") {
            // TODO
          }
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

export default Rect;
