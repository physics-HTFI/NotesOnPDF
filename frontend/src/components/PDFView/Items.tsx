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
import usePdfNotes from "@/hooks/usePdfNotes";
import { Node as NodeType, NoteType } from "@/types/PdfNotes";
import SvgDefs from "./Items/SvgDefs";
import { MouseContext } from "@/contexts/MouseContext";
import { AppSettingsContext } from "@/contexts/AppSettingsContext";

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
  const { appSettings } = useContext(AppSettingsContext);
  const { page, popNote } = usePdfNotes();
  if (!page?.notes || !pageRect || !setMouse) return <SvgDefs />;

  const props = <T extends NoteType | NodeType>(params: T) => ({
    key: JSON.stringify(params),
    mode,
    pageRect,
    params,
    onMouseDown: (e: MouseEvent, note: NoteType | NodeType) => {
      let tmpMode: typeof mode | undefined = undefined;
      if (mode && e.button === 0) tmpMode = mode;
      if (appSettings?.middleClick && e.button === 1)
        tmpMode = appSettings.middleClick;
      if (appSettings?.rightClick && e.button === 2)
        tmpMode = appSettings.rightClick;
      if (!tmpMode) return;
      e.stopPropagation();
      if (tmpMode === "move") onMove(note);
      if (note.type !== "Node") {
        if (tmpMode === "edit") onEdit(note);
        if (tmpMode === "delete") popNote(note);
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
