import { useContext } from "react";
import MouseContext from "@/contexts/MouseContext";
import { Node, NoteType } from "@/types/PdfNotes";
import {
  ArrowIcon,
  BracketIcon,
  ChipIcon,
  MarkerIcon,
  MemoIcon,
  PageLinkIcon,
  PolygonIcon,
  RectIcon,
} from "./Icons";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import Palette from "@/components/common/Palette";
import { PaletteIconType } from "@/types/AppSettings";

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
      renderIcon={(i: number) => getIcon(L, appSettings?.paletteIcons[i])}
      L={L}
      xy={mouse}
      open={open}
      onClose={(i?: number) => {
        onClose(
          getNote(
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

/**
 *  `type`に応じたアイコンを返す
 */
function getIcon(L: number, type?: PaletteIconType) {
  const svgRect = new DOMRect(0, 0, 1.5 * L, 1.5 * L);

  if (type === "Arrow") return <ArrowIcon svgRect={svgRect} />;
  if (type === "Bracket") return <BracketIcon svgRect={svgRect} />;
  if (type === "Chip") return <ChipIcon />;
  if (type === "Marker") return <MarkerIcon svgRect={svgRect} />;
  if (type === "Memo") return <MemoIcon />;
  if (type === "PageLink") return <PageLinkIcon />;
  if (type === "Polygon") return <PolygonIcon svgRect={svgRect} />;
  if (type === "Rect") return <RectIcon svgRect={svgRect} />;
  return <></>;
}

/**
 * `type`に応じた注釈の初期値を返す
 */
function getNote(
  x: number,
  y: number,
  page: number,
  type?: PaletteIconType
): NoteType | Node | undefined {
  if (type === "Arrow")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Arrow",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        heads: ["end"],
      },
    };

  if (type === "Bracket")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Bracket",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        heads: ["start", "end"],
      },
    };

  if (type === "Chip")
    return {
      type: "Chip",
      x,
      y,
      text: "",
      style: "filled",
    };

  if (type === "Marker")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Marker",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
      },
    };

  if (type === "Memo")
    return {
      type: "Memo",
      x,
      y,
      html: "",
    };

  if (type === "PageLink")
    return {
      type: "PageLink",
      x: x,
      y: y,
      page,
    };

  if (type === "Polygon")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Polygon",
        points: [
          [x, y],
          [x, y],
        ],
        style: "filled",
      },
    };

  if (type === "Rect")
    return {
      type: "Node",
      index: 2,
      target: {
        type: "Rect",
        x: x,
        y: y,
        width: 0,
        height: 0,
        style: "filled",
      },
    };

  return undefined;
}
