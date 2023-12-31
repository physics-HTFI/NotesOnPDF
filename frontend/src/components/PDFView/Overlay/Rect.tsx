import React, { useContext, useState } from "react";
import { Mode } from "../SpeedDial";
import { Rect as RectType } from "@/types/Notes";
import PolygonEditor from "./Editors/PolygonEditor";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Rect`の引数
 */
interface Props {
  params: RectType;
  mode: Mode;
  pageRect: DOMRect;
  onDelete: () => void;
}

/**
 * 長方形
 */
const Rect: React.FC<Props> = ({ params, mode, pageRect, onDelete }) => {
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const [edit, setEdit] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
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
          cursor: cursor,
        }}
        onMouseDown={(e) => {
          if (!mode || e.button !== 0) return;
          e.stopPropagation();
          setMouse?.({ pageX: e.pageX, pageY: e.pageY });
          if (mode === "delete") onDelete();
          if (mode === "edit") setEdit(true);
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
      {/* 編集 */}
      {edit && (
        <PolygonEditor
          params={params}
          onClose={() => {
            setEdit(false);
          }}
        />
      )}
    </>
  );
};

export default Rect;
