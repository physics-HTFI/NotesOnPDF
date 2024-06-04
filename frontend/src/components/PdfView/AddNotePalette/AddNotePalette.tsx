import { useContext } from "react";
import MouseContext from "@/contexts/MouseContext";
import { Node, NoteType } from "@/types/PdfNotes";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import getInitialNote from "./getInitialNote";
import Icon from "./Icon";
import Palette from "@/components/common/Palette/Palette";

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
  const { mouse, pageRect } = useContext(MouseContext);
  const { appSettings } = useContext(ModelContext);
  const { pdfNotes } = useContext(PdfNotesContext);
  if (!mouse || !pageRect || !pdfNotes || !open) return <></>;

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
            pdfNotes.currentPage,
            appSettings?.paletteIcons[i ?? -1]
          )
        );
      }}
    />
  );
}
