import React from "react";

/**
 * `Marker`の引数
 */
interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick: () => void;
}

/**
 * 黄色いマーカー
 */
const Marker: React.FC<Props> = ({ x1, y1, x2, y2, onClick }) => {
  return (
    <line
      x1={`${x1}`}
      y1={`${y1}`}
      x2={`${x2}`}
      y2={`${y2}`}
      style={{
        stroke: "yellow",
        opacity: 0.5,
        strokeWidth: "8",
        cursor: "pointer",
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    />
  );
};

export default Marker;
