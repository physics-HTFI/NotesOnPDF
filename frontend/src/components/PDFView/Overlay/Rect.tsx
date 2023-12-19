import React, { useState } from "react";

/**
 * `Rect`の引数
 */
interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
}

/**
 * 長方形
 */
const Rect: React.FC<Props> = ({ x, y, width, height, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ fill: "red", opacity: hover ? 0.2 : 0.3, cursor: "alias" }}
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

export default Rect;
