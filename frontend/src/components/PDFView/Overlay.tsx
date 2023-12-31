import React from "react";
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
import { Mode } from "./SpeedDial";
import { useNotes } from "@/hooks/useNotes";

/**
 * 数式表示のコンフィグ
 */
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
  const { notes, setNotes, pop } = useNotes();
  if (!notes || !setNotes || !pageRect) return <></>;

  const page = notes.pages[notes.currentPage];

  return (
    <>
      <Svg pageRect={pageRect}>
        {page?.notes?.map((p) => {
          const handleDelete = () => {
            pop(p);
          };
          switch (p.type) {
            case "Arrow":
              return (
                <Arrow
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  pageRect={pageRect}
                  onDelete={handleDelete}
                />
              );
            case "Bracket":
              return (
                <Bracket
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  pageRect={pageRect}
                  onDelete={handleDelete}
                />
              );
            case "Marker":
              return (
                <Marker
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  pageRect={pageRect}
                  onDelete={handleDelete}
                />
              );
            case "Polygon":
              return (
                <Polygon
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  pageRect={pageRect}
                  onDelete={handleDelete}
                />
              );
            case "Rect":
              return (
                <Rect
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  pageRect={pageRect}
                  onDelete={handleDelete}
                />
              );
          }
          return undefined;
        })}
      </Svg>
      <MathJaxContext version={3} config={mathjaxConfig}>
        {page?.notes?.map((p) => {
          const handleDelete = () => {
            pop(p);
          };
          switch (p.type) {
            case "Chip":
              return (
                <Chip
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  onDelete={handleDelete}
                />
              );
            case "Note":
              return (
                <Note
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  onDelete={handleDelete}
                />
              );
            case "PageLink":
              return (
                <PageLink
                  key={JSON.stringify(p)}
                  params={p}
                  mode={mode}
                  onDelete={handleDelete}
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
