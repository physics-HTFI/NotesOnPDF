import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import FileTree from "@/types/FileTree";
import Coverages, { Coverage, GetCoverage } from "@/types/Coverages";
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
  initialized: boolean;
}>({ initialized: false });

export default FileTreeContext;

/**
 * `FileTreeContext`のプロバイダー
 */
export function FileTreeContextProvider({ children }: { children: ReactNode }) {
  const { model } = useContext(ModelContext);
  const { readOnly, setErrorMessage } = useContext(UiStateContext);
  const { id, pdfNotes } = useContext(PdfNotesContext);
  const [fileTree, setFileTree] = useState<FileTree>();
  const [coverages, setCoverages] = useState<Coverages>();
  const initialized = !!fileTree && !!coverages;

  // `FileTree`と`Coverages`を取得する
  useEffect(() => {
    load(model)
      .then(({ fileTree, coverages }) => {
        setFileTree(fileTree);
        setCoverages(coverages);
      })
      .catch(() => {
        setErrorMessage(model.getMessage("ファイルツリーの取得"));
      });
  }, [model, setErrorMessage]);

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
      // だが稀なので気にしない（`!readOnly`状態で`Coverages`が変化しないほうが不自然なので）。
      setCoverages(newCoverages);
      if (readOnly) return;
      model.putCoverages(newCoverages).catch(() => {
        setErrorMessage(model.getMessage("進捗率の保存"));
      });
    }
  }

  return (
    <FileTreeContext.Provider value={{ fileTree, coverages, initialized }}>
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
  const newCov = GetCoverage(pdfNotes);
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
