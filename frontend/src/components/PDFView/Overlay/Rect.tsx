import React, { useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { NoteType, Rect as RectType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Rect`の引数
 */
interface Props {
  params: RectType;
  mode?: Mode;
  pageRect: DOMRect;
  onDelete?: () => void;
  onEdit?: (edit: NoteType) => void;
}

/**
 * 長方形
 */
const Rect: React.FC<Props> = ({
  params,
  mode,
  pageRect,
  onDelete,
  onEdit,
}) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <>
      <rect
        x={params.x1 * pageRect.width}
        y={params.y1 * pageRect.height}
        width={(params.x2 - params.x1) * pageRect.width}
        height={(params.y2 - params.y1) * pageRect.height}
        style={{
          fill: "red",
          stroke: params.border ? "red" : "none",
          fillOpacity: params.border ? 0 : hover ? 0.2 : 0.3,
          strokeOpacity: hover ? 0.5 : 1,
          cursor: cursor,
        }}
        onMouseDown={(e) => {
          if (!mode || e.button !== 0) return;
          e.stopPropagation();
          setMouse?.({ pageX: e.pageX, pageY: e.pageY });
          if (mode === "delete") onDelete?.();
          if (mode === "edit") onEdit?.(params);
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
      />
    </>
  );
};

export default Rect;
