import { Arrow as ArrowType } from "@/types/Notes";
import { FC, useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Arrow`の引数
 */
interface Props {
  params: ArrowType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: () => void;
}

/**
 * 矢印などの直線
 */
const Arrow: FC<Props> = ({ params, mode, pageRect, onMouseDown }) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
  const hasStart = ["start", "both"].includes(params.heads ?? "end");
  const hasEnd = ["end", "both"].includes(params.heads ?? "end");
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <g
      style={{ cursor }}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault(); // これがないと、この要素を起点にドラッグすると、ほかの要素の文字列が選択されてしまう
        setMouse?.({ pageX: e.pageX, pageY: e.pageY });
        onMouseDown?.();
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
          strokeWidth: "10",
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
          markerStart: hasStart ? "url(#head)" : undefined,
          markerEnd: hasEnd ? "url(#head)" : undefined,
        }}
      />
    </g>
  );
};

export default Arrow;
