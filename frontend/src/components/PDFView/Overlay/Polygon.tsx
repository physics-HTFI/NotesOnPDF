import { FC, useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { Polygon as PolygonType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Polygon`の引数
 */
interface Props {
  params: PolygonType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: () => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Polygon: FC<Props> = ({ params, mode, pageRect, onMouseDown }) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <>
      <polygon
        points={params.points
          .map((p) => [p[0] * pageRect.width, p[1] * pageRect.height])
          .map((p) => `${p[0]},${p[1]}`)
          .join(" ")}
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
    </>
  );
};

export default Polygon;
