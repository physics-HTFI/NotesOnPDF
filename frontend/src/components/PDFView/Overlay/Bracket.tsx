import { FC, useContext, useState } from "react";
import { Bracket as Bracket } from "@/types/Notes";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Bracket`の引数
 */
interface Props {
  params: Bracket;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: () => void;
}

/**
 * 括弧
 */
const Bracket: FC<Props> = ({ params, mode, pageRect, onMouseDown }) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const x1 = params.x1 * pageRect.width;
  const y1 = params.y1 * pageRect.height;
  const x2 = params.x2 * pageRect.width;
  const y2 = params.y2 * pageRect.height;
  const hasStart = ["start", "both"].includes(params.heads ?? "both");
  const hasEnd = ["end", "both"].includes(params.heads ?? "both");
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <g
      style={{ cursor }}
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
          stroke: "red",
          strokeWidth: "1",
          opacity: hover ? 0.5 : 1,
          markerStart: hasStart ? "url(#bracket)" : undefined,
          markerEnd: hasEnd ? "url(#bracket)" : undefined,
        }}
      />
    </g>
  );
};

export default Bracket;
