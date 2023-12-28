import React, { useContext } from "react";
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
import { NotesContext } from "@/contexts/NotesContext";
import { Mode } from "./Control";

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
  options: {
    enableMenu: false,
  },
};

/**
 * `Overlay`の引数
 */
interface Props {
  mode: Mode;
  pageRect?: DOMRect;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Overlay: React.FC<Props> = ({ mode, pageRect }) => {
  const { notes } = useContext(NotesContext);
  if (!notes || !pageRect) return <></>;

  const page = notes.pages[notes.currentPage];
  const { width, height } = pageRect;
  if (!page?.notes) return <></>;
  return (
    <>
      <Svg width={width} height={height}>
        {page.notes.map((n) => {
          switch (n.type) {
            case "Arrow":
              return (
                <Arrow
                  key={JSON.stringify(n)}
                  x1={n.x1 * width}
                  y1={n.y1 * height}
                  x2={n.x2 * width}
                  y2={n.y2 * height}
                  heads={n.heads ?? "end"}
                  mode={mode}
                  onClick={() => undefined}
                />
              );
            case "Bracket":
              return (
                <Bracket
                  key={JSON.stringify(n)}
                  x1={n.x1 * width}
                  y1={n.y1 * height}
                  x2={n.x2 * width}
                  y2={n.y2 * height}
                  heads={n.heads ?? "start-end"}
                  mode={mode}
                  onClick={() => undefined}
                />
              );
            case "Marker":
              return (
                <Marker
                  key={JSON.stringify(n)}
                  x1={n.x1 * width}
                  y1={n.y1 * height}
                  x2={n.x2 * width}
                  y2={n.y2 * height}
                  mode={mode}
                  onClick={() => undefined}
                />
              );
            case "Polygon":
              return (
                <Polygon
                  key={JSON.stringify(n)}
                  points={n.points.map((p) => [p[0] * width, p[1] * height])}
                  border={n.border}
                  mode={mode}
                  onClick={() => undefined}
                />
              );
            case "Rect":
              return (
                <Rect
                  key={JSON.stringify(n)}
                  x={n.x * width}
                  y={n.y * height}
                  width={n.width * width}
                  height={n.height * height}
                  border={n.border}
                  mode={mode}
                  onClick={() => undefined}
                />
              );
          }
          return undefined;
        })}
      </Svg>
      <MathJaxContext version={3} config={mathjaxConfig}>
        {page.notes.map((n) => {
          switch (n.type) {
            case "Chip":
              return (
                <Chip
                  key={JSON.stringify(n)}
                  x={n.x}
                  y={n.y}
                  label={n.label}
                  outlined={n.outlined ?? false}
                  mode={mode}
                  onClick={() => undefined}
                />
              );
            case "Note":
              return (
                <Note
                  key={JSON.stringify(n)}
                  x={`${100 * n.x}%`}
                  y={`${100 * n.y}%`}
                  html={n.html}
                  mode={mode}
                  onClick={() => undefined}
                />
              );
            case "PageLink":
              return (
                <PageLink
                  key={JSON.stringify(n)}
                  params={n}
                  mode={mode}
                  pageRect={pageRect}
                />
              );
          }
          return undefined;
        })}
      </MathJaxContext>
    </>
  );
};

export default Overlay;
