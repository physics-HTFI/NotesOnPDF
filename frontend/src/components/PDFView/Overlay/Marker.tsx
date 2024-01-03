import { FC, useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { Marker as MarkerType, NoteType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Marker`の引数
 */
interface Props {
  params: MarkerType;
  mode?: Mode;
  pageRect: DOMRect;
  onDelete?: () => void;
  onEdit?: (edit: NoteType) => void;
  onMove?: (edit: NoteType) => void;
}

/**
 * 黄色いマーカー
 */
const Marker: FC<Props> = ({
  params,
  mode,
  pageRect,
  onDelete,
  onEdit,
  onMove,
}) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const cursor =
    !mode || mode === "edit" ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <line
      x1={params.x1 * pageRect.width}
      y1={params.y1 * pageRect.height}
      x2={params.x2 * pageRect.width}
      y2={params.y2 * pageRect.height}
      style={{
        stroke: "yellow",
        opacity: hover ? 0.2 : 0.5,
        strokeWidth: "8",
        cursor: cursor,
      }}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        setMouse?.({ pageX: e.pageX, pageY: e.pageY });
        if (mode === "delete") onDelete?.();
        if (mode === "edit") onEdit?.(params);
        if (mode === "move") onMove?.(params);
      }}
      onMouseEnter={() => {
        setHover(!!cursor);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    />
  );
};

export default Marker;
