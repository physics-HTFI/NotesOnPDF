import { FC } from "react";
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
  onEdit: (note: NoteType) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Overlay: FC<Props> = ({ mode, pageRect, onEdit }) => {
  const { notes, setNotes, popNote } = useNotes();
  if (!notes || !setNotes || !pageRect) return <></>;

  const page = notes.pages[notes.currentPage];
  const props = <T extends NoteType>(p: T) => ({
    key: JSON.stringify(p),
    mode,
    pageRect,
    onDelete: () => {
      popNote(p);
    },
    onEdit,
    params: p,
  });

  return (
    <>
      {/* <Svg>には<def>も含まれているので、注釈がない場合でも存在する必要がある（そうでないとSpeedDialのアイコンが消える？） */}
      <Svg pageRect={pageRect}>
        {page?.notes?.map((p) => {
          switch (p.type) {
            case "Arrow":
              return <Arrow {...props(p)} />;
            case "Bracket":
              return <Bracket {...props(p)} />;
            case "Marker":
              return <Marker {...props(p)} />;
            case "Polygon":
              return <Polygon {...props(p)} />;
            case "Rect":
              return <Rect {...props(p)} />;
          }
          return undefined;
        })}
      </Svg>
      <MathJaxContext version={3} config={mathjaxConfig}>
        {page?.notes?.map((p) => {
          switch (p.type) {
            case "Chip":
              return <Chip {...props(p)} />;
            case "Note":
              return <Note {...props(p)} />;
            case "PageLink":
              return <PageLink {...props(p)} />;
          }
          return undefined;
        })}
      </MathJaxContext>
    </>
  );
};

export default Overlay;
