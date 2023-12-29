import React, { useState } from "react";
import { Mode } from "../SpeedDial";
import { Polygon as PolygonType } from "@/types/Notes";

/**
 * `Polygon`の引数
 */
interface Props {
  params: PolygonType;
  mode: Mode;
  pageRect: DOMRect;
  onDelete: () => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Polygon: React.FC<Props> = ({ params, mode, pageRect, onDelete }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <polygon
      points={params.points
        .map((p) => [p[0] * pageRect.width, p[1] * pageRect.height])
        .map((p) => `${p[0]},${p[1]}`)
        .join(" ")}
      style={{
        fill: "red",
        stroke: params.border ? "red" : "none",
        fillOpacity: params.border ? 0 : hover ? 0.2 : 0.3,
        strokeOpacity: hover ? 0.5 : 1,
        cursor: cursor,
      }}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        if (mode === "delete") onDelete();
        if (mode === "edit") {
          // TODO
        }
        if (mode === "move") {
          // TODO
        }
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
