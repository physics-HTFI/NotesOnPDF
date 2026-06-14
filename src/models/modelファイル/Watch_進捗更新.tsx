import { useAtom, useAtomValue } from "jotai";
import { Watch } from "../Watch/Watch";
import { atomsファイル } from "./atomsファイル";
import { derivsファイル } from "./derivsファイル";
import { modelPdfNotes } from "../modelPdfNotes/modelPdfNotes";
import { getNewCoveragesOrUndefined } from "./utils/useNewCoverages";
import { modelファイル } from "./modelファイル";

/**
 * 進捗の更新を行う
 */
export function Watch_進捗更新() {
  const [coverages, setCoverages] = useAtom(atomsファイル.coverages);
  const fileTree = useAtomValue(derivsファイル.fileTreeValue);
  const path = modelファイル.pdf.path.useValue();
  const pages = modelPdfNotes.pdfNotes.usePages();

  return (
    <>
      {/* pages が変化したら coverages を更新する */}
      <Watch
        target={pages}
        onChange={async () => {
          const newCoverages = getNewCoveragesOrUndefined(
            pages,
            coverages,
            fileTree,
            path,
          );
          if (!newCoverages) return;
          void setCoverages(newCoverages);
        }}
      />
    </>
  );
}
