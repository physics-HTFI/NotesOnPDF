import { useAtomValue, useSetAtom } from "jotai";
import { Watch } from "../Watch/Watch";
import { atomsUI } from "./atomsUI";
import { atomsファイル } from "../modelファイル/atomsファイル";

/**
 * ドロワーの開閉を行う
 */
export function Watch_ドロワー開閉() {
  const setOpenSettingsDrawer = useSetAtom(atomsUI.openDrawer_settings);
  const pdfInfo = useAtomValue(atomsファイル.pdf.info);

  return (
    <>
      {/* PDF ファイルの選択が変化したときに設定ドロワーを閉じる */}
      <Watch
        target={pdfInfo}
        onChange={() => {
          if (pdfInfo.status !== "loaded") return;
          setOpenSettingsDrawer(false);
        }}
      />
    </>
  );
}
