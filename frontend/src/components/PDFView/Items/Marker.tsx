import { FC, MouseEvent, useState } from "react";
import { Mode } from "../SpeedDial";
import {
  Marker as MarkerType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfInfo";
import Node from "./Node";

/**
 * `Marker`の引数
 */
interface Props {
  params: MarkerType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
}

/**
 * 黄色いマーカー
 */
const Marker: FC<Props> = ({ params, mode, pageRect, onMouseDown }) => {
  const [hover, setHover] = useState(false);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
  const cursor =
    !mode || mode === "edit" ? undefined : mode === "move" ? "move" : "pointer";
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
        {/* マーカー本体 */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{
            stroke: "yellow",
            opacity: hover ? 0.3 : 0.5,
            strokeWidth: "8",
          }}
        />
      </g>
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
    </>
  );
};

export default Marker;
