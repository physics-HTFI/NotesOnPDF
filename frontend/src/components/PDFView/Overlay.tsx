import React from "react";
import { Page } from "@/types/Notes";
import Arrow from "./Overlay/Arrow";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Note from "./Overlay/Note";
import PageLink from "./Overlay/PageLink";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";

/**
 * `Overlay`の引数
 */
interface Props {
  page?: Page;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Overlay: React.FC<Props> = () => {
  const [w, h] = [680, 480];
  return (
    <>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "visible",
        }}
      >
        <defs>
          <marker
            viewBox="0 0 10 8"
            id="head"
            orient="auto-start-reverse"
            markerWidth="8"
            markerHeight="10"
            refX="5"
            refY="5"
          >
            <path d="M0,0 V10 L8,5 Z" fill="red" />
          </marker>
          <marker
            viewBox="-2 -1 2 11"
            id="bracket"
            orient="auto"
            markerWidth="4"
            markerHeight="12"
            refX="0"
            refY="10"
          >
            <path
              d="M0,0 V10"
              stroke="red"
              strokeWidth="1"
              strokeLinecap="square"
            />
          </marker>
        </defs>

        <Rect
          x={0.5 * w}
          y={0.5 * h}
          width={0.2 * w}
          height={0.1 * h}
          onClick={() => undefined}
        />
        <Polygon
          points={[
            [0.3 * w, 0.3 * h],
            [0.35 * w, 0.3 * h],
            [0.35 * w, 0.35 * h],
            [0.25 * w, 0.35 * h],
          ]}
          onClick={() => undefined}
        />

        <Arrow
          x1={0.4 * w}
          y1={0.4 * h}
          x2={0.8 * w}
          y2={0.8 * h}
          onClick={() => undefined}
        />

        <Bracket
          x1={0.2 * w}
          y1={0.8 * h}
          x2={0.5 * w}
          y2={0.8 * h}
          onClick={() => undefined}
        />

        <Marker
          x1={0.2 * w}
          y1={0.59 * h}
          x2={0.8 * w}
          y2={0.59 * h}
          onClick={() => undefined}
        />
      </svg>

      <Note
        x="12%"
        y="12%"
        html="<h3>h3</h3>aaaaa<br/>bbb"
        onClick={() => undefined}
      />
      <PageLink x="10%" y="50%" label="p. 100" onClick={() => undefined} />
    </>
  );
};

export default Overlay;
