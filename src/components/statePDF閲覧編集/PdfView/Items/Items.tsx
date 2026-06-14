import { type MouseEvent } from "react";
import Arrow from "./Arrow";
import Bracket from "./Bracket";
import Marker from "./Marker";
import Memo from "./Memo";
import PageLink from "./PageLink";
import Rect from "./Rect";
import Polygon from "./Polygon";
import Chip from "./Chip";
import type { Mode } from "../SpeedDial";
import type { Node as NodeType, NoteType } from "@/types/PdfNotes";
import SvgDefs from "./utils/SvgDefs";
import Svg from "@/components/share/Svg";
import { modelファイル } from "../../../../models/modelファイル/modelファイル";
import { useAtomValue, useSetAtom } from "jotai";
import { usePdf } from "@/models/utils/usePdf/usePdf";
import { modelUI } from "@/models/modelUI/modelUI";
import { modelPdfNotes } from "@/models/modelPdfNotes";

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
  const setMouse = modelUI.mouse.useSet();
  const pageRect = usePdf()?.pageRect?.rect;
  const appSettings = modelファイル.appSettings.useValue();
  const page = useAtomValue(modelPdfNotes.page.atomValue);
  const popNote = useSetAtom(modelPdfNotes.update.atomPopNote);
  if (!page?.notes || !pageRect) return <SvgDefs />;

  const props = <T extends NoteType | NodeType>(params: T) => ({
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
  const key = <T extends NoteType | NodeType>(params: T) =>
    JSON.stringify(params);

  const notes: NoteType[] = page.notes.filter((n) =>
    moveNote?.type === "Node" ? n !== moveNote.target : n !== moveNote,
  );
  return (
    <>
      <SvgDefs />
      <Svg pageRect={pageRect}>
        {notes.map((n) =>
          n.type === "Polygon" ? (
            <Polygon key={key(n)} {...props(n)} />
          ) : undefined,
        )}
        {notes.map((n) =>
          n.type === "Rect" ? <Rect key={key(n)} {...props(n)} /> : undefined,
        )}
        {notes.map((n) =>
          n.type === "Marker" ? (
            <Marker key={key(n)} {...props(n)} />
          ) : undefined,
        )}
        {notes.map((n) =>
          n.type === "Bracket" ? (
            <Bracket key={key(n)} {...props(n)} />
          ) : undefined,
        )}
        {notes.map((n) =>
          n.type === "Arrow" ? <Arrow key={key(n)} {...props(n)} /> : undefined,
        )}
      </Svg>
      {notes.map((n) =>
        n.type === "Memo" ? <Memo key={key(n)} {...props(n)} /> : undefined,
      )}
      {notes.map((n) =>
        n.type === "Chip" ? <Chip key={key(n)} {...props(n)} /> : undefined,
      )}
      {notes.map((n) =>
        n.type === "PageLink" ? (
          <PageLink key={key(n)} {...props(n)} />
        ) : undefined,
      )}
    </>
  );
}
