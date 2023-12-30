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
  const pop = (note: NoteType) => {
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
  const push = (note: NoteType) => {
    const page = notes?.pages[notes.currentPage];
    if (!page || !setNotes) return;
    if (!page.notes) page.notes = [];
    page.notes.push(note);
    setNotes({ ...notes });
  };

  /**
   * `Notes`オブジェクトの現在ページの注釈を入れ替える。
   */
  const update = (pop: NoteType, push: NoteType) => {
    const page = notes?.pages[notes.currentPage];
    if (!page || !setNotes || !page.notes) return;
    page.notes = page.notes.filter((n) => n !== pop);
    page.notes.push(push);
    setNotes({ ...notes });
  };

  return {
    notes,
    setNotes,
    pop,
    push,
    update,
  };
};
