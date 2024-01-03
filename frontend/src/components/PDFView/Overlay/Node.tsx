import { FC, useContext, useState } from "react";
import { MouseContext } from "@/contexts/MouseContext";
import { Node } from "@/types/Notes";

/**
 * `Bracket`の引数
 */
interface Props {
  params: Node;
  pageRect: DOMRect;
  onMouseDown?: () => void;
}

/**
 * ノード編集用マーカー
 */
const Node: FC<Props> = ({ params, pageRect, onMouseDown }) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const t = params.target;
  const [x, y] =
    t.type === "Arrow" || t.type === "Bracket" || t.type === "Marker"
      ? params.index === 0
        ? [t.x1, t.y1]
        : [t.x2, t.y2]
      : t.type === "Polygon"
      ? t.points[params.index] ?? [0, 0]
      : [
          params.index % 2 === 0 ? t.x1 : t.x2,
          params.index / 2 < 1 ? t.y1 : t.y2,
        ];
  return (
    <circle
      cx={x * pageRect.width}
      cy={y * pageRect.height}
      r="5"
      style={{
        fill: "magenta",
        opacity: hover ? 0.5 : 1,
        cursor: "move",
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        setMouse?.({ pageX: e.pageX, pageY: e.pageY });
        onMouseDown?.();
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    />
  );
};

export default Node;
