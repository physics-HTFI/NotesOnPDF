import { Rect, Polygon } from "@/types/PdfNotes";
import Svg from "../../common/Svg";
import RectSvg from "../Items/Rect";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { useContext } from "react";
import MouseContext from "@/contexts/MouseContext";
import Palette from "@/components/common/Palette/Palette";

/**
 * 直方体、ポリゴンの編集パレット
 */
export default function EditRectPalette({
  params,
  open,
  onClose,
}: {
  params: Polygon | Rect;
  open: boolean;
  onClose: () => void;
}) {
  const {
    updaters: { updateNote },
  } = useContext(PdfNotesContext);
  const { mouse } = useContext(MouseContext);
  if (!mouse) return undefined;

  const L = 40;
  const pageRect = new DOMRect(0, 0, L, L);
  const styleList = ["outlined", "filled"] as const;

  /** 1つのアイコンを返す */
  const renderIcon = (i: number) => {
    const style = styleList[i];
    if (!style) return undefined;
    const rect: Rect = {
      type: "Rect",
      x: 0.2,
      y: 0.3,
      width: 0.6,
      height: 0.4,
      style,
    };
    return (
      <Svg pageRect={pageRect}>
        <RectSvg pageRect={pageRect} params={rect} disableNodes />
      </Svg>
    );
  };

  const handleClose = (i?: number) => {
    onClose();
    const style = i === undefined ? undefined : styleList[i];
    if (!style) return; // キャンセル時
    if (style === params.style) return;
    updateNote(params, { ...params, style });
  };

  return (
    <Palette
      numIcons={2}
      renderIcon={renderIcon}
      selected={styleList.indexOf(params.style)}
      L={L}
      xy={mouse}
      open={open}
      onClose={handleClose}
    />
  );
}
