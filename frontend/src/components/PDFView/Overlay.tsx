import React from "react";
import { Page } from "@/types/Notes";
import Arrow from "./Overlay/Arrow";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Note from "./Overlay/Note";
import PageLink from "./Overlay/PageLink";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";
import Svg from "./Overlay/Svg";
import { MathJaxContext } from "better-react-mathjax";
import Chip from "./Overlay/Chip";

const mathjaxConfig = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

/**
 * `Overlay`の引数
 */
interface Props {
  page?: Page;
  width?: number;
  height?: number;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
// TODO ページリンクの数字が正しくない
// TODO マウスホバー時にカーソルを変えるのではなく、注釈の色を変える
const Overlay: React.FC<Props> = ({ page, width, height }) => {
  if (!page?.notes || !width || !height) return <></>;
  return (
    <>
      <Svg width={width} height={height}>
        {page.notes.map((n) => {
          switch (n.type) {
            case "Rect":
              return (
                <Rect
                  x={n.x * width}
                  y={n.y * height}
                  width={n.width * width}
                  height={n.height * height}
                  onClick={() => undefined}
                />
              );
            case "Polygon":
              return (
                <Polygon
                  points={n.points.map((p) => [p[0] * width, p[1] * height])}
                  onClick={() => undefined}
                />
              );
            case "Arrow":
              return (
                <Arrow
                  x1={n.x1 * width}
                  y1={n.y1 * height}
                  x2={n.x2 * width}
                  y2={n.y2 * height}
                  onClick={() => undefined}
                />
              );
            case "Bracket":
              return (
                <Bracket
                  x1={n.x1 * width}
                  y1={n.y1 * height}
                  x2={n.x2 * width}
                  y2={n.y2 * height}
                  onClick={() => undefined}
                />
              );
            case "Marker":
              return (
                <Marker
                  x1={n.x1 * width}
                  y1={n.y1 * height}
                  x2={n.x2 * width}
                  y2={n.y2 * height}
                  onClick={() => undefined}
                />
              );
          }
          return <></>;
        })}
      </Svg>
      <MathJaxContext version={3} config={mathjaxConfig}>
        {page.notes.map((n) => {
          switch (n.type) {
            case "Note":
              return (
                <Note
                  x={`${100 * n.x}%`}
                  y={`${100 * n.y}%`}
                  html={n.html}
                  onClick={() => undefined}
                />
              );
            case "PageLink":
              return (
                <PageLink
                  x={n.x}
                  y={n.y}
                  label={`p. ${n.page}`}
                  onClick={() => undefined}
                />
              );
            case "Chip":
              return (
                <Chip
                  x={n.x}
                  y={n.y}
                  label={n.label}
                  onClick={() => undefined}
                />
              );
          }
          return <></>;
        })}
      </MathJaxContext>
    </>
  );
};

export default Overlay;
