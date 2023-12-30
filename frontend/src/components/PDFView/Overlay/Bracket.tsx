import React, { useState } from "react";
import { Bracket as Bracket } from "@/types/Notes";
import { Mode } from "../SpeedDial";

/**
 * `Bracket`の引数
 */
interface Props {
  params: Bracket;
  mode: Mode;
  pageRect: DOMRect;
  onDelete: () => void;
}

/**
 * 括弧
 */
const Bracket: React.FC<Props> = ({ params, mode, pageRect, onDelete }) => {
  const [hover, setHover] = useState(false);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
  const heads = params.heads ?? "start-end";
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <g
      style={{
        cursor: cursor,
      }}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
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
          stroke: "red",
          strokeWidth: "1",
          opacity: hover ? 0.5 : 1,
          markerStart: heads.includes("start") ? "url(#bracket)" : undefined,
          markerEnd: heads.includes("end") ? "url(#bracket)" : undefined,
        }}
      />
    </g>
  );
};

export default Bracket;
