import {
  Arrow as ArrowType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import { MouseEvent, useState } from "react";
import { Mode } from "../SpeedDial";
import Node from "./Node";
import useCursor from "./utils/useCursor";

interface XY {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * 矢印などの直線
 */
export default function Arrow({
  params,
  mode,
  pageRect,
  onMouseDown,
}: {
  params: ArrowType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}) {
  const [hover, setHover] = useState(false);
  const { cursor, isMove } = useCursor(mode);
  const xy: XY = {
    x1: params.x1 * pageRect.width,
    y1: params.y1 * pageRect.height,
    x2: params.x2 * pageRect.width,
    y2: params.y2 * pageRect.height,
  };
  const lineStyle = {
    opacity: hover ? 0.5 : 1,
    stroke: "red",
    strokeWidth: "1",
  };
  const node = isMove
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
          {...xy}
          style={{
            stroke: "transparent",
            strokeWidth: "30",
          }}
        />
        {/* 背景と混ざらないようにするための白枠 */}
        <line
          {...xy}
          style={{
            stroke: "white",
            opacity: 0.7,
            strokeWidth: "5",
          }}
        />
        {/* 矢印本体 */}
        {params.style === "double" ? (
          getDouble(xy).map((xy, i) => (
            <line key={i} {...xy} style={lineStyle} />
          ))
        ) : (
          <line
            {...xy}
            style={{
              ...lineStyle,
              markerStart: ["inverted", "both"].includes(params.style)
                ? "url(#head)"
                : undefined,
              markerEnd: ["normal", "both"].includes(params.style)
                ? "url(#head)"
                : undefined,
            }}
          />
        )}
      </g>
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
    </>
  );
}

//|
//| ローカル関数
//|

/**
 *  2重線の座標を返す
 */
function getDouble(xy: XY): XY[] {
  const [Δx, Δy] = [xy.x2 - xy.x1, xy.y2 - xy.y1];
  const coeff = 1.5 / Math.sqrt(Δx ** 2 + Δy ** 2);
  const [δx, δy] = [Δy * coeff, -Δx * coeff];
  return [
    {
      x1: xy.x1 + δx,
      y1: xy.y1 + δy,
      x2: xy.x2 + δx,
      y2: xy.y2 + δy,
    },
    {
      x1: xy.x1 - δx,
      y1: xy.y1 - δy,
      x2: xy.x2 - δx,
      y2: xy.y2 - δy,
    },
  ];
}
