import React, { useState } from "react";
import { Heads } from "@/types/Notes";
import { Mode } from "../Control";

/**
 * `Bracket`の引数
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
 * 括弧
 */
const Bracket: React.FC<Props> = ({ x1, y1, x2, y2, heads, mode, onClick }) => {
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
          stroke: "red",
          strokeWidth: "1",
          opacity: hover ? 0.5 : 1,
          markerStart: heads.includes("start") ? "url(#bracket)" : undefined,
          markerEnd: heads.includes("end") ? "url(#bracket)" : undefined,
        }}
      />
    </g>
  );
};

export default Bracket;
