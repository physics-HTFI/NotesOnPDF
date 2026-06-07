import type PdfNotes from "@/types/PdfNotes";
import { type ReactNode, useContext, useEffect, useState } from "react";
import { debounce } from "@mui/material";
import type IModel from "@/models/IModel";
import ModelContext from "../ModelContext/ModelContext";
import useNewCoverages from "./useNewCoverages";
import PdfNotesContext from "./PdfNotesContext";
import useUpdaters from "./useUpdaters";
import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { useAtom } from "jotai";
import { modelUi } from "@/components/global/modelUi";
import { modelPDFファイル } from "@/components/statePDFファイル選択/modelPDFファイル";

/**
 * 間隔をあけて`pdfNotes`を保存する
 */
const putPdfNotesDebounced = debounce(
  (
    id: string,
    pdfNotes: PdfNotes,
    model: IModel,
    setAlert: (severity: "error" | "info", message: ReactNode) => void,
    setReadOnly: (readOnly: boolean) => void,
  ) => {
    model.putPdfNotes(id, pdfNotes).catch(() => {
      setAlert(
        "error",
        <span>
          注釈ファイルの保存に失敗しました。
          <br />
          読み取り専用モードに切り替えました。
        </span>,
      );
      setReadOnly(true);
    });
  },
  1000,
);

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const { model } = useContext(ModelContext);
  const setCoverages = modelPDFファイル.coverages.useSet();
  const setAlert = modelUi.alert.useSet();
  const [readOnly, setReadOnly] = useAtom(modelフォルダ.readOnly.atom);
  const [id, setId] = useState<string>();
  const { getNewCoveragesOrUndefined } = useNewCoverages();
  const updaters = useUpdaters();
  const pdfNotes = updaters.pdfNotes;

  // `pdfNotes`が変更されたときの処理
  useEffect(() => {
    if (!pdfNotes || !id) return;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(updaters.imageNum))
      ?.scrollIntoView({ block: "nearest" });
    if (!readOnly) {
      // 注釈ファイル保存
      putPdfNotesDebounced(id, pdfNotes, model, setAlert, setReadOnly);
      // 必要であれば`coverages`を更新する
      const newCoverages = getNewCoveragesOrUndefined(id, pdfNotes);
      if (newCoverages) {
        void setCoverages(newCoverages);
      }
    }
  }, [
    getNewCoveragesOrUndefined,
    id,
    model,
    pdfNotes,
    readOnly,
    setAlert,
    setCoverages,
    setReadOnly,
    updaters.imageNum,
  ]);

  return (
    <PdfNotesContext.Provider
      value={{
        id,
        pdfNotes,
        page: updaters.page,
        pageLabel: updaters.pageLabel,
        previousPageNum: updaters.previousPageNum,
        imageNum: updaters.imageNum,
        setId,
        updaters,
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
}
