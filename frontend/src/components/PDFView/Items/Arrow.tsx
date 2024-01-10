import {
  Arrow as ArrowType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfInfo";
import { FC, MouseEvent, useState } from "react";
import { Mode } from "../SpeedDial";
import Node from "./Node";

/**
 * `Arrow`の引数
 */
interface Props {
  params: ArrowType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}

/**
 * 矢印などの直線
 */
const Arrow: FC<Props> = ({ params, mode, pageRect, onMouseDown }) => {
  const [hover, setHover] = useState(false);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
  const hasStart = ["start", "both"].includes(params.heads ?? "end");
  const hasEnd = ["end", "both"].includes(params.heads ?? "end");
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  const node =
    mode === "move"
      ? { target: params, visible: hover, pageRect, onMouseDown }
      : undefined;

  return (
    <>
      <g
        style={{ cursor }}
        onMouseDown={(e) => {
          onMouseDown?.(e, params);
        }}
        onMouseEnter={() => {
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        {/* 編集時につかみやすくする */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{
            stroke: "transparent",
            strokeWidth: "30",
          }}
        />
        {/* 背景と混ざらないようにするための白枠 */}
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
        {/* 矢印本体 */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{
            opacity: hover ? 0.5 : 1,
            stroke: "red",
            strokeWidth: "1",
            markerStart: hasStart ? "url(#head)" : undefined,
            markerEnd: hasEnd ? "url(#head)" : undefined,
          }}
        />
      </g>
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
    </>
  );
};

export default Arrow;
