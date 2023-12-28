import React, { useState } from "react";
import { Mode } from "../Control";

/**
 * `Marker`の引数
 */
interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mode: Mode;
  onClick: () => void;
}

/**
 * 黄色いマーカー
 */
const Marker: React.FC<Props> = ({ x1, y1, x2, y2, mode, onClick }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <line
      x1={`${x1}`}
      y1={`${y1}`}
      x2={`${x2}`}
      y2={`${y2}`}
      style={{
        stroke: "yellow",
        opacity: hover ? 0.2 : 0.5,
        strokeWidth: "8",
        cursor: cursor,
      }}
      onMouseDown={(e) => {
        if (e.button !== 2) return;
        e.stopPropagation();
        e.preventDefault();
        onClick();
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
