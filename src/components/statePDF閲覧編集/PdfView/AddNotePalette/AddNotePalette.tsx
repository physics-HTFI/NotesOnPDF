import type { Node, NoteType } from "@/types/PdfNotes";
import getInitialNote from "./getInitialNote";
import Icon from "./Icon";
import Palette from "@/components/share/Palette/Palette";
import { modelファイル } from "../../../../models/modelファイル/modelファイル";
import { useAtomValue } from "jotai";
import { modelUI } from "@/models/modelUI/modelUI";
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
  const mouse = modelUI.mouse.useValue();
  const pageRect = modelファイル.pdf.usePageRectValue()?.rect;
  const pageNum = useAtomValue(modelPdfNotes.atoms.currentPage);
  const appSettings = modelファイル.appSettings.useValue();
  if (!mouse || !pageRect || !open || pageNum === undefined) return <></>;

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
