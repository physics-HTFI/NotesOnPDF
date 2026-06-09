import type PdfNotes from "@/types/PdfNotes";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { watchMaps } from "./Watch/watchMaps";
import { modelファイル } from "./modelファイル";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { useContext } from "react";
import { modelフォルダ } from "./modelフォルダ";
import { modelUI } from "./modelUI";
import {
  createOrGetPdfNotes,
  FORMAT_VERSION,
  type NoteType,
} from "@/types/PdfNotes";
import { usePdf } from "./utils/usePdf/usePdf";
import { debounce } from "@mui/material";

const atomPdfNotes = atom<PdfNotes>();
const atomPreviousPageNum = atom<number>();
const atomPreviousPdfNotes = atom<PdfNotes>();
const atomPreviousNotes = atom<NoteType[]>();

//|
//| 派生 atom
//|

const atomPageValue = atom((get) => {
  const notes = get(atomPdfNotes);
  return notes?.pages[notes.currentPage];
});
const atomPageLabelValue = atom(
  (get) => `p. ${get(atomPageValue)?.num ?? "???"}`,
);
const atomPageNumValue = atom((get) => get(atomPdfNotes)?.currentPage);

/** % 単位 */
function useFontScale() {
  const { pageRect } = usePdf();
  const pdfNotes = useAtomValue(atomPdfNotes);
  if (!pdfNotes || !pageRect?.rect) return 100;
  return (pdfNotes.settings.fontSize * pageRect.rect.width) / 600;
}

//|
//| export
//|

export const modelPdfNotes = {
  pdfNotes: { atom: atomPdfNotes },
  fontScale: { use: useFontScale },
  page: { atomValue: atomPageValue },
  pageNum: { atomValue: atomPageNumValue },
  pageLabel: { atomValue: atomPageLabelValue },

  previous: {
    pageNum: { atom: atomPreviousPageNum },
    pdfNotes: { atom: atomPreviousPdfNotes },
    notes: { atom: atomPreviousNotes },
  },
};

//|
//| Watch
//|

const id = "modelPdfNotes";

/**
 * 間隔をあけて`pdfNotes`を保存する
 */
const putPdfNotesDebounced = debounce(
  (save: () => Promise<void>) => save(),
  1000,
);

// pdfNotes 変更時の処理
watchMaps.pdfNotes.set(id, () => {
  const save = modelフォルダ.json.useSave();
  const jsonPath = useAtomValue(modelファイル.pdf.atomJsonPathValue);
  const pageNum = useAtomValue(modelPdfNotes.pageNum.atomValue);

  return (pdfNotes) => {
    if (!pdfNotes || !jsonPath || pageNum === undefined) return;
    // 目次パネル中の選択されたページが隠れないようにスクロールする
    document
      .getElementById(String(pageNum))
      ?.scrollIntoView({ block: "nearest" });
    // 注釈ファイル保存
    void putPdfNotesDebounced(() => save(pdfNotes, jsonPath));
  };
});

// pdfPath 変更時の処理
watchMaps.pdfPath.set(id, () => {
  const setPdfNotes = useSetAtom(atomPdfNotes);
  const read = modelフォルダ.json.useRead();
  const setAlert = modelUI.alert.useSet();
  const setReadOnly = useSetAtom(modelフォルダ.readOnly.atom);
  const jsonPath = useAtomValue(modelファイル.pdf.atomJsonPathValue);
  const {
    updaters: { assignPdfNotes },
  } = useContext(PdfNotesContext);

  return async (path) => {
    setPdfNotes(undefined);
    if (!path) return;

    assignPdfNotes(undefined);
    if (!jsonPath) return;
    const pdfNotes = await read<PdfNotes>(jsonPath, false);
    setPdfNotes(pdfNotes);
    if (pdfNotes && pdfNotes.version !== FORMAT_VERSION) {
      // TODO マイグレーション
      setAlert(
        "error",
        <>
          注釈ファイルのバージョンが異なります。 <br />
          編集するとファイルの内容が失われる可能性があります。 <br />
          読み取り専用モードに切り替えました。 <br />
        </>,
      );
      await setReadOnly(true);
    }
    assignPdfNotes(createOrGetPdfNotes(jsonPath));
  };
});

// PDF のロードが終わった時の処理
watchMaps.pdfLoaded.set(id, () => {
  const render = modelファイル.pdf.useRenderPage();

  return async (loaded) => {
    // 初期ページをレンダリングする
    if (!loaded) return;
    await render();
  };
});
