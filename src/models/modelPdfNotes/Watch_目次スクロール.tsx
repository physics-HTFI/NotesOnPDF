import { useAtomValue } from "jotai";
import { Watch } from "../Watch/Watch";
import { atomsPdfNotes } from "./atomsPdfNotes";

/**
 * 目次パネル中の選択されたページが隠れないようにスクロールする
 */
export function Watch_目次スクロール() {
  const currentPage = useAtomValue(atomsPdfNotes.pdfNotes.currentPage);

  return (
    <>
      <Watch
        target={currentPage}
        onChange={async () => {
          if (currentPage === undefined) return;
          // 目次パネル中の選択されたページが隠れないようにスクロールする
          document
            .getElementById(String(currentPage))
            ?.scrollIntoView({ block: "nearest" });
        }}
      />
    </>
  );
}
