import { MouseEvent, useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import {
  Marker as MarkerType,
  Node as NodeType,
  NoteType,
} from "@/types/PdfNotes";
import Node from "./Node";
import useCursor from "./useCursor";
import ModelContext from "@/contexts/ModelContext/ModelContext";

/**
 * 黄色いマーカー
 */
export default function Marker({
  params,
  mode,
  pageRect,
  onMouseDown,
  disableNodes,
}: {
  params: MarkerType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (e: MouseEvent, p: NoteType | NodeType) => void;
  disableNodes?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const { isMove } = useCursor(mode);
  const { appSettings } = useContext(ModelContext);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
  const cursor = disableNodes
    ? undefined
    : mode === "move"
    ? "move"
    : mode === "delete"
    ? "pointer"
    : appSettings?.rightClick === "move" ||
      appSettings?.rightClick === "delete" ||
      appSettings?.middleClick === "move" ||
      appSettings?.middleClick === "delete"
    ? "alias"
    : undefined;

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
      <g
        style={{ cursor, mixBlendMode: "multiply" }}
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
            stroke: hover ? "orange" : "yellow",
            opacity: hover ? 0.2 : 0.4,
            strokeWidth: "8",
          }}
        />
      </g>
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
    </>
  );
}
