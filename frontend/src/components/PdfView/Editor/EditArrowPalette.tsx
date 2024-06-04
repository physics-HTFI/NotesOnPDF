import { useContext } from "react";
import { Arrow, Bracket } from "@/types/PdfNotes";
import Svg from "../../common/Svg";
import ArrowItem from "../Items/Arrow";
import BracketItem from "../Items/Bracket";
import MouseContext from "@/contexts/MouseContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import Palette from "@/components/common/Palette/Palette";

/**
 * Arrow, Bracketの編集パレット
 */
export default function EditArrowPalette({
  params,
  open,
  onClose,
}: {
  params: Arrow | Bracket;
  open: boolean;
  onClose: () => void;
}) {
  const {
    updaters: { updateNote },
  } = useContext(PdfNotesContext);
  const { pageRect, mouse } = useContext(MouseContext);
  if (!pageRect || !mouse) return undefined;

  const start = params.heads.includes("start");
  const end = params.heads.includes("end");
  const currentHeads =
    start && end ? "both" : start ? "start" : end ? "end" : "none";
  const L = 40;
  const pageRectIcon = new DOMRect(0, 0, 1.5 * L, 1.5 * L);
  const headsList =
    params.type === "Arrow"
      ? (["end", "both", "start", "none"] as const)
      : (["both", "start", "none", "end"] as const);

  /** 1つのアイコンを返す */
  const renderIcon = (i: number) => {
    const heads = headsList[i];
    if (!heads) return undefined;
    const line: Arrow | Bracket = {
      type: params.type,
      heads: getHeads(heads),
      ...getVector(params, pageRect, params.type === "Arrow" ? 0.8 : 0.7),
    };
    return (
      <Svg pageRect={pageRectIcon}>
        {line.type === "Arrow" ? (
          <ArrowItem pageRect={pageRectIcon} params={line} disableNodes />
        ) : (
          <BracketItem pageRect={pageRectIcon} params={line} disableNodes />
        )}
      </Svg>
    );
  };

  const handleClose = (i?: number) => {
    onClose();
    const newHeads = i === undefined ? undefined : headsList[i];
    if (!newHeads) return; // キャンセル時
    if (newHeads === currentHeads) return;
    updateNote(params, { ...params, heads: getHeads(newHeads) });
  };

  return (
    <Palette
      numIcons={4}
      renderIcon={renderIcon}
      selected={headsList.indexOf(currentHeads)}
      L={L}
      xy={mouse}
      open={open}
      onClose={handleClose}
    />
  );
}

//|
//| ローカル関数
//|

/**
 * 文字列を`params.heads`の値に変換する
 */
function getHeads(headsStr: string): ("start" | "end")[] {
  return headsStr === "start"
    ? ["start"]
    : headsStr === "end"
    ? ["end"]
    : headsStr === "both"
    ? ["start", "end"]
    : [];
}

/**
 * 与えられた直線と同じ向きを持つ`ToggleButton`用ベクトルを返す
 */
function getVector(params: Arrow | Bracket, pageRect: DOMRect, scale: number) {
  const x = (params.x2 - params.x1) * pageRect.width;
  const y = (params.y2 - params.y1) * pageRect.height;
  const l = Math.sqrt(x ** 2 + y ** 2);
  const unitX = x / l;
  const unitY = y / l;
  return {
    x1: 0.5 - scale * 0.5 * unitX,
    y1: 0.5 - scale * 0.5 * unitY,
    x2: 0.5 + scale * 0.5 * unitX,
    y2: 0.5 + scale * 0.5 * unitY,
  };
}
