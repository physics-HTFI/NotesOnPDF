import { FC, useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { Rect as RectType, Node as NodeType, NoteType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";
import Node from "./Node";

/**
 * `Rect`の引数
 */
interface Props {
  params: RectType;
  mode?: Mode;
  pageRect: DOMRect;
  onMouseDown?: (p: NoteType | NodeType) => void;
}

/**
 * 長方形
 */
const Rect: FC<Props> = ({ params, mode, pageRect, onMouseDown }) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  const node =
    mode === "move"
      ? { target: params, visible: hover, pageRect, onMouseDown }
      : undefined;

  return (
    <>
      <rect
        x={params.x * pageRect.width}
        y={params.y * pageRect.height}
        width={params.width * pageRect.width}
        height={params.height * pageRect.height}
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
          onMouseDown?.(params);
        }}
        onMouseEnter={() => {
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
      {node && <Node index={0} {...node} />}
      {node && <Node index={1} {...node} />}
      {node && <Node index={2} {...node} />}
      {node && <Node index={3} {...node} />}
    </>
  );
};

export default Rect;
