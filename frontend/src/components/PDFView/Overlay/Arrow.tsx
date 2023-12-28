import { Heads } from "@/types/Notes";
import React, { useState } from "react";
import { Mode } from "../Control";

/**
 * `Arrow`の引数
 */
interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  heads: Heads;
  mode: Mode;
  onClick: () => void;
}

/**
 * 矢印などの直線
 */
const Arrow: React.FC<Props> = ({ x1, y1, x2, y2, heads, mode, onClick }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <g
      style={{
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
    >
      <line
        x1={`${x1}`}
        y1={`${y1}`}
        x2={`${x2}`}
        y2={`${y2}`}
        style={{
          stroke: "white",
          opacity: 0.7,
          strokeWidth: "5",
        }}
      />
      <line
        x1={`${x1}`}
        y1={`${y1}`}
        x2={`${x2}`}
        y2={`${y2}`}
        style={{
          opacity: hover ? 0.5 : 1,
          stroke: "red",
          strokeWidth: "1",
          markerStart: heads.includes("start") ? "url(#head)" : undefined,
          markerEnd: heads.includes("end") ? "url(#head)" : undefined,
        }}
      />
    </g>
  );
};

export default Arrow;
