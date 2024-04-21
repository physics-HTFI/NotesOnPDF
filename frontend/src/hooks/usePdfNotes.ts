import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import { NoteType } from "@/types/PdfNotes";
import { useContext } from "react";

/**
 * Context内の`pdfNotes, setPdfNotes`および更新用関数`update`を返す。
 */
export const usePdfNotes = () => {
  const { pdfNotes, setPdfNotes } = useContext(PdfNotesContext);
  const page = pdfNotes?.pages[pdfNotes.currentPage];

  /**
   * `PdfNotes`オブジェクトの現在ページから注釈を消去する。
   */
  const _popNote = (note: NoteType) => {
    if (!page) return;
    page.notes = page.notes?.filter((n) => n !== note);
    if (!page.notes) return;
    if (page.notes.length === 0) page.notes = undefined;
  };
  const popNote = (note: NoteType) => {
    if (!pdfNotes) return;
    _popNote(note);
    setPdfNotes({ ...pdfNotes });
  };

  /**
   * `PdfNotes`オブジェクトの現在ページに注釈を追加する。
   */
  const _pushNote = (note: NoteType) => {
    if (!page) return;
    page.notes ??= [];
    page.notes.push(note);
    pdfNotes.pages[pdfNotes.currentPage] = page;
  };
  const pushNote = (note: NoteType) => {
    if (!pdfNotes) return;
    _pushNote(note);
    setPdfNotes({ ...pdfNotes });
  };

  /**
   * `PdfNotes`オブジェクトの現在ページの注釈を入れ替える。
   * `pop`がない場合は`push`の追加だけが行われる。
   */
  const updateNote = (pop: NoteType, push: NoteType) => {
    // if (JSON.stringify(pop) === JSON.stringify(push)) return; // Polygonの追加時はtrueになるのでまずい
    if (!pdfNotes) return;
    _popNote(pop);
    _pushNote(push);
    setPdfNotes({ ...pdfNotes });
  };

  return {
    pdfNotes,
    setPdfNotes,
    page: pdfNotes?.pages[pdfNotes.currentPage],
    popNote,
    pushNote,
    updateNote,
  };
};
