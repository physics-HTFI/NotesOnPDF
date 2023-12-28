import React, { useState } from "react";
import { Mode } from "../Control";

/**
 * `Polygon`の引数
 */
interface Props {
  points: [number, number][];
  border?: boolean;
  mode: Mode;
  onClick: () => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Polygon: React.FC<Props> = ({ points, border, mode, onClick }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <polygon
      points={points.map((p) => `${p[0]},${p[1]}`).join(" ")}
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

export default Polygon;
