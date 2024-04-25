import { useCallback, useContext, useEffect, useState } from "react";
import { Coverage, Coverages } from "@/types/Coverages";
import { FileTree } from "@/types/FileTree";
import { ModelContext } from "@/contexts/ModelContext";
import { PdfNotes } from "@/types/PdfNotes";
import IModel from "@/models/IModel";

/**
 * `FileTree`と`Coverages`を取得する
 */
async function load(model: IModel) {
  const fileTree = await model.getFileTree();
  const coverages = await model.getCoverages();
  // ファイルツリー内に存在しないファイルの情報を削除する
  const pdfs: Record<string, Coverage> = {};
  for (const pdf of Object.entries(coverages.pdfs)) {
    const entry = fileTree.find((f) => f.id === pdf[0]);
    if (!entry) continue;
    pdfs[pdf[0]] = pdf[1];
  }
  return { fileTree, coverages };
}

/**
 * 更新済みの`coverages`を返す。更新不要の場合は`undefined`。
 */
function getNewCoverages(
  coverages?: Coverages,
  id?: string,
  pdfNotes?: PdfNotes,
  fileTree?: FileTree
) {
  if (!id || !pdfNotes || !coverages || !fileTree) return;
  if (!fileTree.find((f) => f.id === id)) return;

  const oldCov = coverages.pdfs[id];
  const newCov: Coverage = {
    allPages: pdfNotes.pages.length,
    enabledPages:
      pdfNotes.pages.length -
      pdfNotes.pages.filter((p) => p.style?.includes("excluded")).length,
    notedPages: pdfNotes.pages.filter(
      (p) => !p.style?.includes("excluded") && p.notes?.length
    ).length,
  };
  const unchanged =
    oldCov?.allPages === newCov.allPages &&
    oldCov.enabledPages === newCov.enabledPages &&
    oldCov.notedPages === newCov.notedPages;
  if (unchanged) {
    return;
  } else {
    const newCoverages = { ...coverages };
    newCoverages.pdfs[id] = newCov;
    return newCoverages;
  }
}

/**
 * `FileTree`と`Coverages`を操作するフック
 */
const useFileTree = () => {
  const { model } = useContext(ModelContext);
  const [fileTree, setFileTree] = useState<FileTree>([]);
  const [coverages, setCoverages] = useState<Coverages>();

  /**
   * `FileTree`と`Coverages`を取得する
   */
  const loadFileTree = useCallback(() => {
    load(model)
      .then(({ fileTree, coverages }) => {
        setFileTree(fileTree);
        setCoverages(coverages);
      })
      .catch(() => undefined);
  }, [model]);

  // `FileTree`と`Coverages`を取得する
  useEffect(loadFileTree, [loadFileTree]);

  // `Coverages`を保存する
  useEffect(() => {
    if (!coverages) return;
    model.putCoverages(coverages).catch(() => undefined);
  }, [model, coverages]);

  /**
   * 選択IDが変更されたときに`coverages`を更新する
   */
  const updateCoveragesIfRecentIdChanged = (recentId?: string) => {
    if (!coverages || recentId === coverages.recentId) return;
    setCoverages({ ...coverages, recentId });
  };

  /**
   * `PdfNotes`が変更されたときに`coverages`を更新する
   */
  const updateCoveragesIfPdfNotesChanged = (
    id?: string,
    pdfNotes?: PdfNotes
  ) => {
    if (!id || !pdfNotes) return;
    const newCov = getNewCoverages(coverages, id, pdfNotes, fileTree);
    if (newCov) {
      setCoverages(newCov);
    }
  };

  return {
    fileTree,
    coverages,
    /**
     * `FileTree`と`Coverages`を再取得する
     */
    reloadFileTree: loadFileTree,
    /**
     * 選択IDが変更されたときに`coverages`を更新する
     */
    updateCoveragesIfRecentIdChanged,
    /**
     * `PdfNotes`が変更されたときに`coverages`を更新する
     */
    updateCoveragesIfPdfNotesChanged,
  };
};

export default useFileTree;
