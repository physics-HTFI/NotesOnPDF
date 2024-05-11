import { MouseEvent, useState } from "react";
import { Mode } from "../SpeedDial";
import {
  Polygon as PolygonType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import Node from "./Node";
import useCursor from "./useCursor";

/**
 * ポリゴン
 */
export default function Polygon({
  params,
  mode,
  pageRect,
  onMouseDown,
  disableNodes,
}: {
  params: PolygonType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
  disableNodes?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const { getCursor, isMove } = useCursor(mode);
  const cursor = disableNodes ? undefined : getCursor();
  const node =
    !disableNodes && isMove
      ? {
          target: params,
          visible: hover,
          pageRect,
          onMouseDown,
          isGrab: mode === "move",
        }
      : undefined;

  return (
    <>
      <polygon
        points={params.points
          .map((p) => [p[0] * pageRect.width, p[1] * pageRect.height])
          .map((p) => `${p[0]},${p[1]}`)
          .join(" ")}
        style={{
          fill: "red",
          stroke: params.style === "outlined" ? "red" : "none",
          fillOpacity: params.style === "outlined" ? 0 : hover ? 0.2 : 0.3,
          strokeOpacity: hover ? 0.5 : 1,
          cursor,
          mixBlendMode: "multiply",
        }}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={() => {
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
      {node &&
        params.points.map((_, i) => <Node key={i} index={i} {...node} />)}
    </>
  );
}
