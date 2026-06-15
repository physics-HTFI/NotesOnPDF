import { useAtomValue, useSetAtom } from "jotai";
import { Watch } from "../Watch/Watch";
import { atomsファイル } from "../modelファイル/atomsファイル";
import { derivsPDF履歴 } from "./derivsPDF履歴";

/**
 * PDF 履歴にファイルを追加する
 */
export function Watch_PDF履歴追加() {
  const pdfInfo = useAtomValue(atomsファイル.pdf.info);
  const addHistory = useSetAtom(derivsPDF履歴.history.add);

  return (
    <>
      {/* PDF ファイルが読み込まれたら履歴を追加する */}
      <Watch
        target={pdfInfo}
        onChange={() => {
          if (pdfInfo.status !== "loaded") return;
          void addHistory(pdfInfo);
        }}
      />
    </>
  );
}
