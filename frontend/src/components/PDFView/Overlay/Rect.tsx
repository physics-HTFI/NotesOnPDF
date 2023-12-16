import React from "react";

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
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ fill: "red", opacity: 0.3, cursor: "pointer" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    />
  );
};

export default Rect;
