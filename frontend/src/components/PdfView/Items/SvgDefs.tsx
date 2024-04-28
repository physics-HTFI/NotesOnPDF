import { FC } from "react";

/**
 * `Overlay.tsx`で使用する<svg>の<def>要素
 */
const SvgDefs: FC = () => (
  <svg>
    <defs>
      {/* `Arrow.tsx`で使用するマーカー */}
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

      {/* `Bracket.tsx`で使用するマーカー */}
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
  </svg>
);

export default SvgDefs;
