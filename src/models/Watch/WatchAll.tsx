import { Watch_PDF履歴入出力 } from "../modelPDF履歴/Watch_PDF履歴入出力";
import { Watch_ドロワー開閉 } from "../modelUI/Watch_ドロワー開閉";
import { Watch_PDF履歴追加 } from "../modelPDF履歴/Watch_PDF履歴追加";
import { Watch_PDF描画 } from "../modelファイル/Watch_PDF描画";
import { Watch_設定入出力 } from "../modelファイル/Watch_設定入出力";
import { Watch_進捗更新 } from "../modelファイル/Watch_進捗更新";
import { Watch_進捗入出力 } from "../modelファイル/Watch_進捗入出力";
import { Watch_pdfNotes入出力 } from "../modelPdfNotes/Watch_pdfNotes入出力";
import { Watch_目次スクロール } from "../modelPdfNotes/Watch_目次スクロール";

/**
 * 変更の変化を監視して処理を行う
 */
export function WatchAll() {
  return (
    <>
      <Watch_pdfNotes入出力 />
      <Watch_目次スクロール />
      <Watch_PDF履歴入出力 />
      <Watch_PDF履歴追加 />
      <Watch_ドロワー開閉 />
      <Watch_PDF描画 />
      <Watch_PDF描画 />
      <Watch_設定入出力 />
      <Watch_進捗入出力 />
      <Watch_進捗更新 />
    </>
  );
}
