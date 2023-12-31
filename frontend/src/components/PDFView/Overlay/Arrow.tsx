import { Arrow as ArrowType, NoteType } from "@/types/Notes";
import React, { useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Arrow`の引数
 */
interface Props {
  params: ArrowType;
  mode: Mode;
  pageRect: DOMRect;
  onDelete: () => void;
  onEdit: (edit: NoteType) => void;
}

/**
 * 矢印などの直線
 */
const Arrow: React.FC<Props> = ({
  params,
  mode,
  pageRect,
  onDelete,
  onEdit,
}) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
  const heads = params.heads ?? "end";
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <g
      style={{
        cursor: cursor,
      }}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
        setMouse?.({ pageX: e.pageX, pageY: e.pageY });
        if (mode === "delete") onDelete();
        if (mode === "edit") onEdit(params);
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
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        style={{
          stroke: "white",
          opacity: 0.7,
          strokeWidth: "5",
        }}
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        style={{
          opacity: hover ? 0.5 : 1,
          stroke: "red",
          strokeWidth: "1",
          markerStart: heads.includes("start") ? "url(#head)" : undefined,
          markerEnd: heads.includes("end") ? "url(#head)" : undefined,
        }}
      />
    </g>
  );
};

export default Arrow;
