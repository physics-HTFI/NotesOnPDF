import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Watch } from "../Watch/Watch";
import { atomsファイル } from "./atomsファイル";
import { pdfUtils } from "../../utils/pdfUtils/pdfUtils";
import { derivsファイル } from "./derivsファイル";
import { atomsUI } from "../modelUI/atomsUI";
import { atomsフォルダ } from "../modelフォルダ/atomsフォルダ";

/**
 * PDF の読み込み／アンロードを行う
 */
export function Watch_PDF読み込み() {
  const setWaiting = useSetAtom(atomsUI.waiting);
  const handle = useAtomValue(derivsファイル.pdfHandleValue);
  const setOpenDrawer = useSetAtom(atomsUI.openDrawer_pdfSelector);
  const setPdfInfo = useSetAtom(atomsファイル.pdf.info);
  const [path, setPath] = useAtom(atomsファイル.pdf.path);
  const folder = useAtomValue(atomsフォルダ.folder);

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

      {/* folder が非選択状態に戻ったらアンロード */}
      <Watch
        target={folder}
        onChange={() => {
          if (folder) return;
          setPath(undefined);
        }}
      />
    </>
  );
}
