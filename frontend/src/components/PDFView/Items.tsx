import { FC, MouseEvent, useContext } from "react";
import Arrow from "./Items/Arrow";
import Bracket from "./Items/Bracket";
import Marker from "./Items/Marker";
import Note from "./Items/Note";
import PageLink from "./Items/PageLink";
import Rect from "./Items/Rect";
import Polygon from "./Items/Polygon";
import Chip from "./Items/Chip";
import Svg from "./Items/Svg";
import { Mode } from "./SpeedDial";
import { usePdfInfo } from "@/hooks/usePdfInfo";
import { Node as NodeType, NoteType } from "@/types/PdfInfo";
import SvgDefs from "./Items/SvgDefs";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Items`の引数
 */
interface Props {
  mode: Mode;
  pageRect?: DOMRect;
  moveNote?: NoteType | NodeType;
  onEdit: (note: NoteType) => void;
  onMove: (note: NoteType | NodeType) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Items: FC<Props> = ({ mode, pageRect, moveNote, onEdit, onMove }) => {
  const { setMouse } = useContext(MouseContext);
  const { page, setPdfInfo, popNote } = usePdfInfo();
  if (!page?.notes || !setPdfInfo || !pageRect || !setMouse) return <SvgDefs />;

  const props = <T extends NoteType | NodeType>(params: T) => ({
    key: JSON.stringify(params),
    mode,
    pageRect,
    params,
    onMouseDown: (e: MouseEvent, note: NoteType | NodeType) => {
      if (!mode || e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault(); // これがないと`NoteEditor`の表示時にフォーカスが当たらなくなることがある
      if (mode === "move") onMove(note);
      if (note.type !== "Node") {
        if (mode === "edit") onEdit(note);
        if (mode === "delete") popNote(note);
      }
      setMouse({ pageX: e.pageX, pageY: e.pageY });
    },
  });

  const notes: NoteType[] = page.notes.filter((n) =>
    moveNote?.type === "Node" ? n !== moveNote.target : n !== moveNote
  );
  return (
    <>
      <SvgDefs />
      <Svg pageRect={pageRect}>
        {notes.map((n) => {
          return n.type === "Polygon" ? <Polygon {...props(n)} /> : undefined;
        })}
        {notes.map((n) => {
          return n.type === "Rect" ? <Rect {...props(n)} /> : undefined;
        })}
        {notes.map((n) => {
          return n.type === "Marker" ? <Marker {...props(n)} /> : undefined;
        })}
        {notes.map((n) => {
          return n.type === "Bracket" ? <Bracket {...props(n)} /> : undefined;
        })}
        {notes.map((n) => {
          return n.type === "Arrow" ? <Arrow {...props(n)} /> : undefined;
        })}
      </Svg>
      {notes.map((n) => {
        return n.type === "Note" ? <Note {...props(n)} /> : undefined;
      })}
      {notes.map((n) => {
        return n.type === "Chip" ? <Chip {...props(n)} /> : undefined;
      })}
      {notes.map((n) => {
        return n.type === "PageLink" ? <PageLink {...props(n)} /> : undefined;
      })}
    </>
  );
};

export default Items;
