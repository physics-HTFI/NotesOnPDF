import { MouseEvent } from "react";
import { Mode } from "../SpeedDial";
import {
  Polygon as PolygonType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import Node from "./Node";
import usePolygon from "./utils/usePolygon";

/**
 * ポリゴン
 */
export default function Polygon({
  params,
  mode,
  moving,
  pageRect,
  onMouseDown,
}: {
  params: PolygonType;
  mode?: Mode;
  moving?: boolean;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}) {
  const { node, style, onMouseEnter, onMouseLeave } = usePolygon(
    params,
    pageRect,
    mode,
    moving,
    onMouseDown
  );

  return (
    <>
      <polygon
        points={params.points
          .map((p) => [p[0] * pageRect.width, p[1] * pageRect.height])
          .map((p) => `${p[0]},${p[1]}`)
          .join(" ")}
        style={style}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      {node &&
        params.points.map((_, i) => <Node key={i} index={i} {...node} />)}
    </>
  );
}
