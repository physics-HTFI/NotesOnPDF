import { PdfInfoContext } from "@/contexts/PdfInfoContext";
import { NoteType } from "@/types/PdfInfo";
import { useContext } from "react";

/**
 * Context内の`pdfInfo, setPdfInfo`および更新用関数`update`を返す。
 */
export const usePdfInfo = () => {
  const { pdfInfo, setPdfInfo } = useContext(PdfInfoContext);

  /**
   * `PdfInfo`オブジェクトの現在ページから注釈を消去する。
   */
  const popNote = (note: NoteType) => {
    const page = pdfInfo?.pages[pdfInfo.currentPage];
    if (!page || !setPdfInfo) return;
    page.notes = page.notes?.filter((n) => n !== note);
    if (!page.notes) return;
    if (page.notes.length === 0) page.notes = undefined;
    setPdfInfo({ ...pdfInfo });
  };

  /**
   * `PdfInfo`オブジェクトの現在ページに注釈を追加する。
   */
  const pushNote = (note: NoteType) => {
    if (!pdfInfo || !setPdfInfo) return;
    const page = pdfInfo.pages[pdfInfo.currentPage] ?? {};
    page.notes ??= [];
    page.notes.push(note);
    pdfInfo.pages[pdfInfo.currentPage] = page;
    setPdfInfo({ ...pdfInfo });
  };

  /**
   * `PdfInfo`オブジェクトの現在ページの注釈を入れ替える。
   * `pop`がない場合は`push`の追加だけが行われる。
   */
  const updateNote = (pop: NoteType, push: NoteType) => {
    // if (JSON.stringify(pop) === JSON.stringify(push)) return; // Polygonの追加時はtrueになるのでまずい
    // TODO ↓setPdfInfoが2回呼ばれるので、2回レンダリングしている可能性がある
    popNote(pop);
    pushNote(push);
  };

  return {
    pdfInfo,
    setPdfInfo,
    page: pdfInfo?.pages[pdfInfo.currentPage],
    popNote,
    pushNote,
    updateNote,
  };
};
