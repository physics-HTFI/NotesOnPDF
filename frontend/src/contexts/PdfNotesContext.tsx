import PdfNotes from "@/types/PdfNotes";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { debounce } from "@mui/material";
import IModel from "@/models/IModel";
import ModelContext from "./ModelContext/ModelContext";
import UiContext from "./UiContext";
import Coverages, { GetCoverage } from "@/types/Coverages";
import FileTree from "@/types/FileTree";

export interface PageSize {
  width: number;
  height: number;
}

/**
 * 注釈のコンテクスト
 */
const PdfNotesContext = createContext<{
  id?: string;
  pdfNotes?: PdfNotes;
  pageSizes?: PageSize[];
  previousPageNum?: number;
  setId: (id?: string) => void;
  setPdfNotes: (pdfNotes?: PdfNotes) => void;
  setPageSizes: (pageSizes?: PageSize[]) => void;
  setPreviousPageNum: (previousPageNum?: number) => void;
}>({
  setId: () => undefined,
  setPdfNotes: () => undefined,
  setPageSizes: () => undefined,
  setPreviousPageNum: () => undefined,
});

export default PdfNotesContext;

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const { model, fileTree, coverages, setCoverages } = useContext(ModelContext);
  const { readOnly, setAlert } = useContext(UiContext);
  const [id, setId_] = useState<string>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const [pageSizes, setPageSizes] = useState<PageSize[]>();
  const [previousPageNum, setPreviousPageNum] = useState<number>();

  const setId = (id?: string) => {
    setId_(id);
    setPreviousPageNum(undefined);
  };

  // 変更されたら保存
  const putPdfNotesDebounced = useMemo(
    () =>
      debounce(
        (
          id: string,
          pdfNotes: PdfNotes,
          model: IModel,
          setAlert: (
            severity?: "error" | "info" | undefined,
            message?: string | JSX.Element | undefined
          ) => void
        ) => {
          model.putPdfNotes(id, pdfNotes).catch(() => {
            setAlert("error", "注釈ファイルの保存に失敗しました");
          });
        },
        1000
      ),
    []
  );
  useEffect(() => {
    if (!pdfNotes || !id) return;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(pdfNotes.currentPage))
      ?.scrollIntoView({ block: "nearest" });
    if (readOnly) return;
    // 注釈ファイル保存
    putPdfNotesDebounced(id, pdfNotes, model, setAlert);
    // 必要であれば`coverages`を更新する
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
    }
  }, [
    coverages,
    fileTree,
    id,
    model,
    pdfNotes,
    putPdfNotesDebounced,
    readOnly,
    setAlert,
    setCoverages,
  ]);

  return (
    <PdfNotesContext.Provider
      value={{
        id,
        pdfNotes,
        pageSizes,
        previousPageNum,
        setId,
        setPdfNotes,
        setPageSizes,
        setPreviousPageNum,
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
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
