import { useAtomValue, useSetAtom } from "jotai";
import { Watch } from "../Watch/Watch";
import { atomsファイル } from "./atomsファイル";
import { pdfUtils } from "../../utils/pdfUtils/pdfUtils";
import { derivsファイル } from "./derivsファイル";
import { atomsUI } from "../modelUI/atomsUI";

/**
 * PDF の読み込みを行う
 */
export function Watch_PDF描画() {
  const setWaiting = useSetAtom(atomsUI.waiting);
  const handle = useAtomValue(derivsファイル.pdfHandleValue);
  const setOpenDrawer = useSetAtom(atomsUI.openDrawer_pdfSelector);
  const setPdfInfo = useSetAtom(atomsファイル.pdf.info);
  const path = useAtomValue(atomsファイル.pdf.path);

  return (
    <>
      {/* PDF ファイルのパスが変わったら読み込み／アンロード */}
      <Watch
        target={path}
        onChange={() => {
          document.title = "NotesOnPDF";
          setWaiting(true);
          setPdfInfo({ status: "not-loaded" });
          // 読み込み開始
          pdfUtils.setPdfHandle(handle, (totalPages) => {
            const isOk = totalPages !== undefined;
            setWaiting(false);
            setOpenDrawer(!isOk);
            document.title = handle?.name ?? "NotesOnPDF";
            if (path !== undefined && isOk) {
              setPdfInfo({ status: "loaded", path, totalPages });
            }
          });
        }}
      />
    </>
  );
}
