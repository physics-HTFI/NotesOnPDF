import type { Node, NoteType } from "@/types/PdfNotes";
import getInitialNote from "./getInitialNote";
import Icon from "./Icon";
import Palette from "@/components/share/Palette/Palette";
import { modelファイル } from "../../../../models/modelファイル";
import { useAtomValue } from "jotai";
import { usePdf } from "@/models/utils/usePdf/usePdf";
import { modelUI } from "@/models/modelUI";
import { modelPdfNotes } from "@/models/modelPdfNotes";

/**
 * PDFビュークリック時に表示されるパレット型コントロール
 */
export default function AddNotePalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (note?: NoteType | Node) => void;
}) {
  const mouse = useAtomValue(modelUI.mouse.atom);
  const pageRect = usePdf()?.pageRect?.rect;
  const pageNum = useAtomValue(modelPdfNotes.currentPageNum.atom);
  const appSettings = useAtomValue(modelファイル.appSettings.atom);
  const pdfNotes = useAtomValue(modelPdfNotes.pdfNotes.atom);
  if (!mouse || !pageRect || !pdfNotes || !open || pageNum === undefined)
    return <></>;

  const L = 50;

  return (
    <Palette
      numIcons={8}
      renderIcon={(i: number) => (
        <Icon L={L} type={appSettings?.paletteIcons[i]} />
      )}
      L={L}
      xy={mouse}
      open={open}
      onClose={(i?: number) => {
        onClose(
          getInitialNote(
            (mouse.pageX - pageRect.x) / pageRect.width,
            (mouse.pageY - pageRect.y) / pageRect.height,
            pageNum,
            appSettings?.paletteIcons[i ?? -1],
          ),
        );
      }}
    />
  );
}
