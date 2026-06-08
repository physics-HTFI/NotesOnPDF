import type PdfNotes from "@/types/PdfNotes";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { watchMaps } from "./Watch/watchMaps";
import { modelファイル } from "./modelファイル";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { useContext } from "react";
import { modelフォルダ } from "./modelフォルダ";
import { modelUI } from "./modelUI";
import { parsePath } from "./utils/parsePath";
import { createOrGetPdfNotes, FORMAT_VERSION } from "@/types/PdfNotes";
import { usePdf } from "./utils/usePdf/usePdf";

const atomPdfNotes = atom<PdfNotes>();

/**
 * % 単位
 */
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
};

//|
//| Watch
//|

const id = "modelPdfNotes";

// pdfPath 変更時の処理
watchMaps.pdfPath.set(id, () => {
  const setPdfNotes = useSetAtom(atomPdfNotes);
  const read = modelフォルダ.json.useRead();
  const setAlert = modelUI.alert.useSet();
  const setReadOnly = useSetAtom(modelフォルダ.readOnly.atom);
  const {
    updaters: { assignPdfNotes },
  } = useContext(PdfNotesContext);

  return async (path) => {
    setPdfNotes(undefined);
    if (!path) return;

    assignPdfNotes(undefined);
    const jsonPath = parsePath(path);
    if (!jsonPath) return;
    const pdfNotes = await read<PdfNotes>(jsonPath.jsonPath, false);
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

// PDF のロードが終わった時にページをレンダリングする
watchMaps.pdfLoaded.set(id, () => {
  const render = modelファイル.pdf.useRenderPage();
  return async (loaded) => {
    if (!loaded) return;
    await render();
  };
});
