import { useAtomValue, useSetAtom } from "jotai";
import { Watch } from "../Watch/Watch";
import { modelファイル } from "../modelファイル";
import { atomsUI } from "./atomsUI";

/**
 * ドロワーの開閉を行う
 */
export function Watch_ドロワー開閉() {
  const pdfPath = useAtomValue(modelファイル.pdf.atomPath);
  const setOpenSettingsDrawer = useSetAtom(atomsUI.openDrawer_settings);

  return (
    <>
      {/* PDF ファイルの選択が変化したときに設定ドロワーを閉じる */}
      <Watch
        target={pdfPath}
        onChange={() => {
          setOpenSettingsDrawer(false);
        }}
      />
    </>
  );
}
