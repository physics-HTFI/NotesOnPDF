import React, { useState } from "react";

/**
 * `Polygon`の引数
 */
interface Props {
  points: [number, number][];
  onClick: () => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Polygon: React.FC<Props> = ({ points, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <polygon
      points={points.map((p) => `${p[0]},${p[1]}`).join(" ")}
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

export default Polygon;
