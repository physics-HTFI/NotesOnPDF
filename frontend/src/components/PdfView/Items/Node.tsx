import { MouseEvent, useContext, useState } from "react";
import {
  Arrow,
  Bracket,
  Marker,
  Node as NodeType,
  NoteType,
  Polygon,
  Rect,
} from "@/types/PdfNotes";
import { green } from "@mui/material/colors";
import { Mode } from "../SpeedDial";
import ModelContext from "@/contexts/ModelContext/ModelContext";

/**
 * 注釈形状編集用ノード
 */
export default function Nodes({
  target,
  mode,
  visible,
  pageRect,
  onMouseDown,
}: {
  target: Arrow | Bracket | Marker | Polygon | Rect;
  mode: Mode;
  visible: boolean;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}) {
  const { appSettings } = useContext(ModelContext);

  // 編集ノードの位置
  const points: [number, number][] =
    target.type === "Rect"
      ? new Array(4)
          .fill(0)
          .map((_, i) => [
            target.x + (i % 2 === 0 ? 0 : target.width),
            target.y + (i / 2 < 1 ? 0 : target.height),
          ])
      : target.type === "Polygon"
      ? target.points
      : [
          [target.x1, target.y1],
          [target.x2, target.y2],
        ];

  const [hover, setHover] = useState(points.map(() => false));

  const isMoveMode = [
    mode,
    appSettings?.rightClick,
    appSettings?.middleClick,
  ].includes("move");
  if (!isMoveMode) return undefined;

  return points.map((p, i) => (
    <g
      key={i}
      style={{
        fill: visible || hover[i] ? green.A700 : "transparent",
        cursor: mode === "move" ? "grab" : "alias",
      }}
      onMouseDown={(e) => {
        onMouseDown?.(e, { type: "Node", target, index: i });
      }}
      onMouseEnter={() => {
        hover[i] = true;
        setHover([...hover]);
      }}
      onMouseLeave={() => {
        hover[i] = false;
        setHover([...hover]);
      }}
    >
      <circle cx={p[0] * pageRect.width} cy={p[1] * pageRect.height} r="3" />
      <circle
        cx={p[0] * pageRect.width}
        cy={p[1] * pageRect.height}
        r="10"
        style={{ fill: hover[i] ? undefined : "transparent" }}
      />
    </g>
  ));
}
