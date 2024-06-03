import { useContext } from "react";
import MouseContext from "@/contexts/MouseContext";
import { Node, NoteType } from "@/types/PdfNotes";
import {
  ArrowIcon,
  BracketIcon,
  ChipIcon,
  IconProps,
  MarkerIcon,
  MemoIcon,
  PageLinkIcon,
  PolygonIcon,
  RectIcon,
} from "./Icons";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import Palette from "@/components/common/Palette";

/**
 * PDFビュークリック時に表示されるパレット型コントロール
 */
export default function AddNotePalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (note: NoteType | Node) => void;
}) {
  const { mouse, pageRect } = useContext(MouseContext);
  const { appSettings } = useContext(ModelContext);
  const { pdfNotes } = useContext(PdfNotesContext);
  if (!mouse || !pageRect || !pdfNotes || !open) return <></>;

  const L = 50;
  const renderIcon = (i: number) => {
    const iconProps: Omit<IconProps, "sx"> = {
      onClose,
      x: (mouse.pageX - pageRect.x) / pageRect.width,
      y: (mouse.pageY - pageRect.y) / pageRect.height,
      page: pdfNotes.currentPage,
      svgRect: new DOMRect(0, 0, 1.5 * L, 1.5 * L),
    };

    const type = appSettings?.paletteIcons[i];
    if (type === "Arrow") return <ArrowIcon {...iconProps} />;
    if (type === "Bracket") return <BracketIcon {...iconProps} />;
    if (type === "Chip") return <ChipIcon {...iconProps} />;
    if (type === "Marker") return <MarkerIcon {...iconProps} />;
    if (type === "Memo") return <MemoIcon {...iconProps} />;
    if (type === "PageLink") return <PageLinkIcon {...iconProps} />;
    if (type === "Polygon") return <PolygonIcon {...iconProps} />;
    if (type === "Rect") return <RectIcon {...iconProps} />;
    return <></>;
  };

  return (
    <Palette
      numIcons={8}
      renderIcon={renderIcon}
      L={L}
      xy={mouse}
      open={open}
    />
  );
}
