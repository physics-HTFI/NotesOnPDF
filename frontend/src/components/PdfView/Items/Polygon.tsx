import { MouseEvent } from "react";
import { Mode } from "../SpeedDial";
import {
  Polygon as PolygonType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import getPolygonStyle from "./utils/getPolygonStyle";
import useCursor from "./utils/useCursor";
import Nodes from "./Node";

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
  const { cursor, hover, onMouseEnter, onMouseLeave } = useCursor(mode);

  return (
    <>
      <polygon
        points={params.points
          .map((p) => [p[0] * pageRect.width, p[1] * pageRect.height])
          .map((p) => `${p[0]},${p[1]}`)
          .join(" ")}
        style={getPolygonStyle(params, hover, cursor, moving)}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      <Nodes
        target={params}
        mode={mode}
        visible={hover}
        pageRect={pageRect}
        onMouseDown={onMouseDown}
      />
    </>
  );
}
