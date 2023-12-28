import React, { useState } from "react";
import { Mode } from "../Control";

/**
 * `Rect`の引数
 */
interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  border?: boolean;
  mode: Mode;
  onClick: () => void;
}

/**
 * 長方形
 */
const Rect: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  border,
  mode,
  onClick,
}) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        fill: "red",
        stroke: border ? "red" : "none",
        fillOpacity: border ? 0 : hover ? 0.2 : 0.3,
        strokeOpacity: hover ? 0.5 : 1,
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

export default Rect;
