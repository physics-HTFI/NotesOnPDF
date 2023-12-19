import React, { useState } from "react";

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
  const [hover, setHover] = useState(false);
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
    />
  );
};

export default Marker;
