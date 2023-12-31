import React, { useState } from "react";
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
import Editor from "./Overlay/Editors/Editor";
import { NoteType } from "@/types/Notes";

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
  const [editPrams, setEditParams] = useState<NoteType>();
  if (!notes || !setNotes || !pageRect) return <></>;

  const page = notes.pages[notes.currentPage];

  return (
    <>
      <Svg pageRect={pageRect}>
        {page?.notes?.map((p) => {
          const props = {
            key: JSON.stringify(p),
            mode,
            pageRect,
            onDelete: () => {
              pop(p);
            },
            onEdit: setEditParams,
          };
          switch (p.type) {
            case "Arrow":
              return <Arrow params={p} {...props} />;
            case "Bracket":
              return <Bracket params={p} {...props} />;
            case "Marker":
              return <Marker params={p} {...props} />;
            case "Polygon":
              return <Polygon params={p} {...props} />;
            case "Rect":
              return <Rect params={p} {...props} />;
          }
          return undefined;
        })}
      </Svg>
      <MathJaxContext version={3} config={mathjaxConfig}>
        {page?.notes?.map((p) => {
          const props = {
            key: JSON.stringify(p),
            mode,
            pageRect,
            onDelete: () => {
              pop(p);
            },
            onEdit: setEditParams,
          };
          switch (p.type) {
            case "Chip":
              return <Chip params={p} {...props} />;
            case "Note":
              return <Note params={p} {...props} />;
            case "PageLink":
              return <PageLink params={p} {...props} />;
          }
          return undefined;
        })}
      </MathJaxContext>

      {/* 編集エディター */}
      <Editor
        open={Boolean(editPrams)}
        params={editPrams}
        onClose={() => {
          setEditParams(undefined);
        }}
      />
    </>
  );
};

export default Overlay;
