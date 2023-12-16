import React from "react";

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
  return (
    <g
      style={{
        cursor: "pointer",
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
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
          markerStart: "url(#bracket)",
          markerEnd: "url(#bracket)",
        }}
      />
    </g>
  );
};

export default Bracket;
