import React, { useState } from "react";

/**
 * `Bracket`の引数
 */
interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick: () => void;
}

/**
 * 括弧
 */
const Bracket: React.FC<Props> = ({ x1, y1, x2, y2, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <g
      style={{
        cursor: "alias",
      }}
      onMouseDown={(e) => {
        if (e.button !== 2) return;
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      onMouseEnter={() => {
        setHover(true);
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
          markerStart: "url(#bracket)",
          markerEnd: "url(#bracket)",
        }}
      />
    </g>
  );
};

export default Bracket;
