import React, { ReactNode } from "react";

/**
 * `Svg`の引数
 */
interface Props {
  width: number;
  height: number;
  children: ReactNode;
}

/**
 * `Overlay.tsx`で使用する<svg>要素
 */
const Svg: React.FC<Props> = ({ width, height, children }) => (
  <svg
    viewBox={`0 0 ${width} ${height}`}
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      overflow: "visible",
    }}
  >
    <defs>
      <marker
        viewBox="0 0 10 8"
        id="head"
        orient="auto-start-reverse"
        markerWidth="8"
        markerHeight="10"
        refX="5"
        refY="5"
      >
        <path d="M0,0 V10 L8,5 Z" fill="red" />
      </marker>
      <marker
        viewBox="-2 -1 2 11"
        id="bracket"
        orient="auto"
        markerWidth="4"
        markerHeight="12"
        refX="0"
        refY="10"
      >
        <path
          d="M0,0 V10"
          stroke="red"
          strokeWidth="1"
          strokeLinecap="square"
        />
      </marker>
    </defs>
    {children}
  </svg>
);

export default Svg;