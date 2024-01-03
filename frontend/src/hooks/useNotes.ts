import { NotesContext } from "@/contexts/NotesContext";
import { NoteType } from "@/types/Notes";
import { useContext } from "react";

/**
 * Context内の`notes, setNotes`および更新用関数`update`を返す。
 */
export const useNotes = () => {
  const { notes, setNotes } = useContext(NotesContext);

  /**
   * `Notes`オブジェクトの現在ページから注釈を消去する。
   */
  const popNote = (note: NoteType) => {
    const page = notes?.pages[notes.currentPage];
    if (!page || !setNotes) return;
    page.notes = page.notes?.filter((n) => n !== note);
    if (!page.notes) return;
    if (page.notes.length === 0) page.notes = undefined;
    setNotes({ ...notes });
  };

  /**
   * `Notes`オブジェクトの現在ページに注釈を追加する。
   */
  const pushNote = (note: NoteType) => {
    if (!notes || !setNotes) return;
    const page = notes.pages[notes.currentPage] ?? {};
    page.notes ??= [];
    page.notes.push(note);
    notes.pages[notes.currentPage] = page;
    setNotes({ ...notes });
  };

  /**
   * `Notes`オブジェクトの現在ページの注釈を入れ替える。
   * `pop`がない場合は`push`の追加だけが行われる。
   */
  const updateNote = (pop: NoteType, push: NoteType) => {
    if (JSON.stringify(pop) === JSON.stringify(push)) return;
    // TODO setNotesが2回呼ばれるので、2回レンダリングしている可能性がある
    popNote(pop);
    pushNote(push);
  };

  return {
    notes,
    setNotes,
    page: notes?.pages[notes.currentPage],
    popNote,
    pushNote,
    updateNote,
  };
};
