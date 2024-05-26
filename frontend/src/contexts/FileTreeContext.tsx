import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import FileTree from "@/types/FileTree";
import Coverages, { Coverage } from "@/types/Coverages";
import IModel from "@/models/IModel";
import PdfNotesContext from "./PdfNotesContext";
import PdfNotes from "@/types/PdfNotes";
import ModelContext from "./ModelContext";
import UiStateContext from "./UiStateContext";

/**
 * ファイルツリーと履歴のコンテクスト
 */
const FileTreeContext = createContext<{
  fileTree?: FileTree;
  coverages?: Coverages;
}>({});

export default FileTreeContext;

/**
 * `FileTreeContext`のプロバイダー
 */
export function FileTreeContextProvider({ children }: { children: ReactNode }) {
  const { model } = useContext(ModelContext);
  const { readOnly, setSnackbarMessage } = useContext(UiStateContext);
  const { id, pdfNotes } = useContext(PdfNotesContext);
  const [fileTree, setFileTree] = useState<FileTree>();
  const [coverages, setCoverages] = useState<Coverages>();

  // `FileTree`と`Coverages`を取得する
  useEffect(() => {
    setSnackbarMessage(undefined);
    load(model)
      .then(({ fileTree, coverages }) => {
        setFileTree(fileTree);
        setCoverages(coverages);
      })
      .catch(() => {
        setSnackbarMessage(model.getMessage("ファイルツリーの取得"));
      });
  }, [model, setSnackbarMessage]);

  // `id`または`pdfNotes`が変更されたときに、必要であれば`Coverages`を更新する
  if (id && pdfNotes) {
    const newCoverages = getNewCoveragesOrUndefined(
      coverages,
      id,
      pdfNotes,
      fileTree
    );
    if (newCoverages) {
      // `Coverages`が不整合になることがある：
      // ・`readOnly`状態で`pdfNotes`を変更→別のファイルを開いて`readOnly`を解除、としたときに前のファイルの`Coverage`が変化してしまう。
      // だがレアなので気にしない（`!readOnly`状態で`Coverages`が変化しないほうが不自然なので）。
      setCoverages(newCoverages);
      if (!readOnly) {
        setSnackbarMessage(undefined);
        model.putCoverages(newCoverages).catch(() => {
          setSnackbarMessage(model.getMessage("進捗率の保存"));
        });
      }
    }
  }

  return (
    <FileTreeContext.Provider value={{ fileTree, coverages }}>
      {children}
    </FileTreeContext.Provider>
  );
}

/**
 * `FileTree`と`Coverages`を取得する
 */
async function load(model: IModel) {
  const fileTree = await model.getFileTree();
  const coverages = await model.getCoverages();
  // ファイルツリー内に存在しないファイルの情報を削除する
  const pdfs: Record<string, Coverage> = {};
  for (const [id, coverage] of Object.entries(coverages.pdfs)) {
    if (!fileTree.some((f) => f.id === id)) continue;
    pdfs[id] = coverage;
  }
  coverages.pdfs = pdfs;
  return { fileTree, coverages };
}

/**
 * 更新済みの`coverages`を返す。更新不要の場合は`undefined`。
 */
function getNewCoveragesOrUndefined(
  coverages?: Coverages,
  id?: string,
  pdfNotes?: PdfNotes,
  fileTree?: FileTree
) {
  if (!id || !pdfNotes || !coverages || !fileTree) return undefined;
  if (!fileTree.find((f) => f.id === id)) return undefined;

  const oldCov = coverages.pdfs[id];
  const enabledPages =
    pdfNotes.pages.length -
    pdfNotes.pages.filter((p) => p.style?.includes("excluded")).length;
  const notedPages = pdfNotes.pages.filter(
    (p) => !p.style?.includes("excluded") && p.notes?.length
  ).length;
  const newCov: Coverage = {
    allPages: pdfNotes.pages.length,
    enabledPages,
    notedPages,
    percent: Math.min(
      100,
      Math.max(0, Math.round((100 * notedPages) / Math.max(1, enabledPages)))
    ),
  };
  const unchanged =
    coverages.recentId === id &&
    oldCov?.allPages === newCov.allPages &&
    oldCov.enabledPages === newCov.enabledPages &&
    oldCov.notedPages === newCov.notedPages;
  if (unchanged) return undefined;
  const newCoverages: Coverages = { ...coverages, recentId: id };
  newCoverages.pdfs[id] = newCov;
  return newCoverages;
}
