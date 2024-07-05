import { MouseEvent, useContext } from "react";
import Arrow from "./Arrow";
import Bracket from "./Bracket";
import Marker from "./Marker";
import Memo from "./Memo";
import PageLink from "./PageLink";
import Rect from "./Rect";
import Polygon from "./Polygon";
import Chip from "./Chip";
import Svg from "../../common/Svg";
import { Mode } from "../SpeedDial";
import { Node as NodeType, NoteType } from "@/types/PdfNotes";
import SvgDefs from "./utils/SvgDefs";
import MouseContext from "@/contexts/MouseContext";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * 注釈を表示するコントロール
 */
export default function Items({
  mode,
  moveNote,
  onEdit,
  onMove,
}: {
  mode: Mode;
  moveNote?: NoteType | NodeType;
  onEdit: (note: NoteType) => void;
  onMove: (note: NoteType | NodeType) => void;
}) {
  const { pageRect, setMouse } = useContext(MouseContext);
  const { appSettings } = useContext(ModelContext);
  const {
    page,
    updaters: { popNote },
  } = useContext(PdfNotesContext);
  if (!page?.notes || !pageRect) return <SvgDefs />;

  const props = <T extends NoteType | NodeType>(params: T) => ({
    key: JSON.stringify(params),
    mode,
    pageRect,
    params,
    onMouseDown: (e: MouseEvent, note: NoteType | NodeType) => {
      let md: typeof mode | undefined = undefined;
      if (mode && e.button === 0) md = mode;
      if (appSettings?.middleClick && e.button === 1)
        md = appSettings.middleClick;
      if (appSettings?.rightClick && e.button === 2)
        md = appSettings.rightClick;
      if (!md) return;
      e.stopPropagation();
      if (md === "move") onMove(note);
      if (note.type !== "Node") {
        if (md === "edit") onEdit(note);
        if (md === "delete") popNote(note);
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
        return n.type === "Memo" ? <Memo {...props(n)} /> : undefined;
      })}
      {notes.map((n) => {
        return n.type === "Chip" ? <Chip {...props(n)} /> : undefined;
      })}
      {notes.map((n) => {
        return n.type === "PageLink" ? <PageLink {...props(n)} /> : undefined;
      })}
    </>
  );
}
