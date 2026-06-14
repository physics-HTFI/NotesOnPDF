import { useAtomValue, useSetAtom } from "jotai";
import { Watch } from "../Watch/Watch";
import { debounce } from "@mui/material";
import { DEBOUNCE_DELAY } from "@/types/CONSTANTS";
import { modelフォルダ } from "../modelフォルダ/modelフォルダ";
import { modelファイル } from "../modelファイル/modelファイル";
import { derivsPdfNotes } from "./derivsPdfNotes";
import { derivsファイル } from "../modelファイル/derivsファイル";
import { atomsファイル } from "../modelファイル/atomsファイル";
import { modelUI } from "../modelUI/modelUI";
import {
  createOrGetPdfNotes as getOrCreatePdfNotes,
  FORMAT_VERSION,
} from "@/types/PdfNotes";
import type PdfNotes from "@/types/PdfNotes";

/**
 * 間隔をあけて`pdfNotes`を保存する。
 * TODO: PDF ファイルを閉じたときに即時保存する。
 */
const putPdfNotesDebounced = debounce(
  (save: () => Promise<void>) => save(),
  DEBOUNCE_DELAY,
);

/**
 * pdfNotes の入出力を行う
 */
export function Watch_pdfNotes入出力() {
  const pdfNotes = useAtomValue(derivsPdfNotes.values.pdfNotes);
  const assignPdfNotes = useSetAtom(derivsPdfNotes.assignPdfNotes);
  const read = modelフォルダ.json.useRead();
  const save = modelフォルダ.json.useSave();
  const setAlert = modelUI.alert.useSet();
  const jsonPath = useAtomValue(derivsファイル.jsonPathValue);
  const pdfInfo = useAtomValue(atomsファイル.pdf.info);
  const title = modelファイル.pdf.useTitleValue();
  const setReadOnly = modelフォルダ.readOnly.useSet();

  return (
    <>
      {/* pdfNotes が変更されたら保存 */}
      <Watch
        target={pdfNotes}
        onChange={async () => {
          if (!pdfNotes || !jsonPath) return;
          void putPdfNotesDebounced(() => save(pdfNotes, jsonPath));
        }}
      />

      {/* PDF の読み込みが終わったら pdfNotes を読み込む */}
      <Watch
        target={pdfInfo}
        onChange={async () => {
          // PDF の読み込みが終わるまでは pdfNotes は無効にしておく
          if (!jsonPath || !title || pdfInfo.status !== "loaded") {
            assignPdfNotes(undefined);
            return;
          }
          // pdfNotes を読み込む
          // ページ数の情報が必要なので、PDF の読み込みが終わってから実行している。
          const pdfNotes = await read<PdfNotes>(jsonPath, false);
          if (pdfNotes && pdfNotes.version !== FORMAT_VERSION) {
            // TODO マイグレーション
            setAlert(
              "error",
              <>
                注釈ファイルのバージョンが異なるため開けません。 <br />
                読み取り専用モードに切り替えました。 <br />
              </>,
            );
            await setReadOnly(true);
            return;
          }
          assignPdfNotes(
            getOrCreatePdfNotes(title, pdfInfo.totalPages, pdfNotes),
          );
        }}
      />
    </>
  );
}
