import { CSSProperties } from "react";
import { Rect as RectType, Polygon as PolygonType } from "@/types/PdfNotes";

export default function getPolygonStyle(
  params: PolygonType | RectType,
  hover: boolean,
  cursor: string | undefined,
  moving?: boolean
): CSSProperties {
  const isColorize = params.style === "colorize" && !hover && !moving;

  return {
    fill: isColorize ? "red" : "#fbb",
    stroke: params.style === "outlined" ? "red" : "none",
    fillOpacity: params.style === "outlined" ? 0 : hover ? 0.7 : 1.0,
    strokeOpacity: hover ? 0.5 : 1,
    cursor,
    mixBlendMode: isColorize ? "lighten" : "multiply",
  };
}
