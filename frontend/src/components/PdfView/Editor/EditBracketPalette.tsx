import { useContext } from "react";
import { Bracket } from "@/types/PdfNotes";
import Svg from "../../common/Svg";
import BracketItem from "../Items/Bracket";
import MouseContext from "@/contexts/MouseContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import Palette from "@/components/common/Palette/Palette";
import getVector from "./getVector";

/**
 * Bracketの編集パレット
 */
export default function EditBracketPalette({
  params,
  onClose,
}: {
  params: Bracket;
  onClose: () => void;
}) {
  const {
    updaters: { updateNote },
  } = useContext(PdfNotesContext);
  const { pageRect, mouse } = useContext(MouseContext);
  if (!pageRect || !mouse) return undefined;

  const L = 40;
  const pageRectIcon = new DOMRect(0, 0, 1.5 * L, 1.5 * L);
  const styles = [
    "normal",
    "end",
    "middle",
    "start",
  ] satisfies (typeof params.style)[];

  /** 1つのアイコンを返す */
  const renderIcon = (i: number) => {
    const style = styles[i];
    if (!style) return undefined;
    const line: Bracket = {
      type: "Bracket",
      style,
      ...getVector(params, pageRect, 0.8),
    };
    return (
      <Svg pageRect={pageRectIcon}>
        <BracketItem pageRect={pageRectIcon} params={line} disableNodes />
      </Svg>
    );
  };

  return (
    <Palette
      open
      numIcons={4}
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
