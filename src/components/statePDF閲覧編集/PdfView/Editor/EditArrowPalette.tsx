import { type Arrow } from "@/types/PdfNotes";
import ArrowItem from "../Items/Arrow";
import Palette from "@/components/share/Palette/Palette";
import getVector from "./getVector";
import Svg from "@/components/share/Svg";
import { modelUI } from "@/models/modelUI/modelUI";
import { modelPdfNotes } from "@/models/modelPdfNotes/modelPdfNotes";
import { modelファイル } from "@/models/modelファイル/modelファイル";

/**
 * Arrowの編集パレット
 */
export default function EditArrowPalette({
  params,
  onClose,
}: {
  params: Arrow;
  onClose: () => void;
}) {
  const updateNote = modelPdfNotes.update.useSetNote();
  const mouse = modelUI.mouse.useValue();
  const pageRect = modelファイル.pdf.usePageRectValue()?.rect;
  if (!pageRect || !mouse) return undefined;

  const L = 40;
  const pageRectIcon = new DOMRect(0, 0, 1.5 * L, 1.5 * L);
  const styles = [
    "normal",
    "both",
    "inverted",
    "single",
    "double",
  ] satisfies (typeof params.style)[];

  /** 1つのアイコンを返す */
  const renderIcon = (i: number) => {
    const style = styles[i];
    if (!style) return undefined;
    const line: Arrow = {
      type: "Arrow",
      style,
      ...getVector(params, pageRect, 0.8),
    };
    return (
      <Svg pageRect={pageRectIcon}>
        <ArrowItem pageRect={pageRectIcon} params={line} />
      </Svg>
    );
  };

  return (
    <Palette
      open
      numIcons={5}
      renderIcon={renderIcon}
      selected={styles.indexOf(params.style)}
      L={L}
      xy={mouse}
      onClose={(i?: number) => {
        onClose();
        const style = i === undefined ? undefined : styles[i];
        if (!style) return; // キャンセル時
        if (style === params.style) return;
        updateNote(params, { ...params, style });
      }}
    />
  );
}
