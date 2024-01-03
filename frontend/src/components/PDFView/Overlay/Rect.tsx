import { FC, useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { Rect as RectType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Rect`の引数
 */
interface Props {
  params: RectType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: () => void;
}

/**
 * 長方形
 */
const Rect: FC<Props> = ({ params, mode, pageRect, onMouseDown }) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
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
        cursor,
      }}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        setMouse?.({ pageX: e.pageX, pageY: e.pageY });
        onMouseDown?.();
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

export default Rect;
