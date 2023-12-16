import React from "react";

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
  return (
    <polygon
      points={points.map((p) => `${p[0]},${p[1]}`).join(" ")}
      style={{ fill: "red", opacity: 0.3, cursor: "pointer" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    />
  );
};

export default Polygon;
