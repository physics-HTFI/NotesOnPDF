import React from "react";
import { Notes } from "@/types/Notes";
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
  options: {
    enableMenu: false,
  },
};

/**
 * `Overlay`の引数
 */
interface Props {
  notes?: Notes;
  pageRect?: DOMRect;
  onNotesChanged: (notes: Notes) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Overlay: React.FC<Props> = ({ notes, pageRect, onNotesChanged }) => {
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
                  onClick={() => undefined}
                />
              );
            case "Polygon":
              return (
                <Polygon
                  key={JSON.stringify(n)}
                  points={n.points.map((p) => [p[0] * width, p[1] * height])}
                  border={n.border}
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
                  onClick={() => undefined}
                />
              );
            case "PageLink":
              return (
                <PageLink
                  key={JSON.stringify(n)}
                  params={n}
                  notes={notes}
                  pageRect={pageRect}
                  onNotesChanged={onNotesChanged}
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
