import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import FileTree from "@/types/FileTree";
import Coverages, { Coverage } from "@/types/Coverages";
import ModelContext from "./ModelContext";
import IModel from "@/models/IModel";
import PdfNotesContext from "./PdfNotesContext";
import PdfNotes from "@/types/PdfNotes";

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
  const { id, pdfNotes } = useContext(PdfNotesContext);
  const [fileTree, setFileTree] = useState<FileTree>();
  const [coverages, setCoverages] = useState<Coverages>();

  // `FileTree`と`Coverages`を取得する
  useEffect(() => {
    load(model)
      .then(({ fileTree, coverages }) => {
        setFileTree(fileTree);
        setCoverages(coverages);
      })
      .catch(() => undefined);
  }, [model]);

  // `id`または`pdfNotes`が変更されたときに、必要であれば`Coverages`を更新する
  if (id && pdfNotes) {
    const newCoverages = getNewCoverages(coverages, id, pdfNotes, fileTree);
    if (newCoverages) {
      setCoverages(newCoverages);
      model.putCoverages(newCoverages).catch(() => undefined);
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
  if (!id || !pdfNotes || !coverages || !fileTree) return undefined;
  if (!fileTree.find((f) => f.id === id)) return undefined;

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
    coverages.recentId === id &&
    oldCov?.allPages === newCov.allPages &&
    oldCov.enabledPages === newCov.enabledPages &&
    oldCov.notedPages === newCov.notedPages;
  if (unchanged) return undefined;
  const newCoverages: Coverages = { ...coverages, recentId: id };
  newCoverages.pdfs[id] = newCov;
  return newCoverages;
}
