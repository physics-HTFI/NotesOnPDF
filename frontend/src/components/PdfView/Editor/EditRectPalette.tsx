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
  onClose,
}: {
  params: Polygon | Rect;
  onClose: () => void;
}) {
  const {
    updaters: { updateNote },
  } = useContext(PdfNotesContext);
  const { mouse } = useContext(MouseContext);
  if (!mouse) return undefined;

  const L = 40;
  const pageRect = new DOMRect(0, 0, L, L);
  const styleList = ["outlined", "filled", "colorize"] as const;

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
      <Svg pageRect={pageRect} style={{ background: "white" }}>
        {style === "colorize" && (
          <text x={0.2 * pageRect.width} y={0.5 * pageRect.height}>
            着色
          </text>
        )}
        <RectSvg pageRect={pageRect} params={rect} />
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
      open
      numIcons={3}
      renderIcon={renderIcon}
      selected={styleList.indexOf(params.style)}
      L={L}
      xy={mouse}
      onClose={handleClose}
    />
  );
}
