import { useAtomValue, useSetAtom } from "jotai";
import { watchMaps } from "../Watch/watchMaps";
import { usePdf } from "../utils/usePdf/usePdf";
import { atomsUI } from "../modelUI/atomsUI";
import { atomsファイル } from "./atomsファイル";
import { derivsファイル } from "./derivsファイル";

//|
//| export
//|

export const modelファイル = {
  fileTree: {
    useValue: () => useAtomValue(derivsファイル.fileTreeValue),
  },

  coverages: {
    useValue: () => useAtomValue(atomsファイル.coverages),
  },

  appSettings: {
    useValue: () => useAtomValue(atomsファイル.appSettings),
    useSet: () => useSetAtom(atomsファイル.appSettings),
  },

  pdf: {
    path: {
      useValue: () => useAtomValue(atomsファイル.pdf.path),
      useSet: () => useSetAtom(atomsファイル.pdf.path),
    },
    useTitleValue: () => useAtomValue(derivsファイル.titleValue),
    useJsonPathValue: () => useAtomValue(derivsファイル.jsonPathValue),
  },
};

//|
//| watch
//|

const id = "modelPDFファイル";

// pdfPath 変更時の処理
watchMaps.pdfPath.set(id, () => {
  const setWaiting = useSetAtom(atomsUI.waiting);
  const { setPdfHandle } = usePdf();
  const handle = useAtomValue(derivsファイル.pdfHandleValue);
  const setOpenDrawer = useSetAtom(atomsUI.openDrawer_pdfSelector);
  const setPdfInfo = useSetAtom(atomsファイル.pdf.info);

  return async (path) => {
    document.title = "NotesOnPDF";

    // PDF ファイル読み込み／アンロード
    setWaiting(true);
    setPdfInfo({ status: "not-loaded" });
    setPdfHandle(handle, (totalPages) => {
      setWaiting(false);
      setOpenDrawer(!handle);
      document.title = handle?.name ?? "NotesOnPDF";
      if (path !== undefined && totalPages !== undefined) {
        setPdfInfo({ status: "loaded", path, totalPages });
      }
    });
  };
});
