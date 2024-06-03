import { useContext } from "react";
import { Box, SxProps } from "@mui/material";
import { Arrow, Bracket } from "@/types/PdfNotes";
import Svg from "../../common/Svg";
import ArrowItem from "../Items/Arrow";
import BracketItem from "../Items/Bracket";
import MouseContext from "@/contexts/MouseContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { red } from "@mui/material/colors";

/**
 * Arrow, Bracketの編集ダイアログのアイコン
 */
export default function ArrowEditorIcons(
  L: number,
  params: Arrow | Bracket,
  onClose: () => void
) {
  const {
    updaters: { updateNote },
  } = useContext(PdfNotesContext);
  const { pageRect } = useContext(MouseContext);
  if (!pageRect) return [];

  const start = params.heads.includes("start");
  const end = params.heads.includes("end");
  const currentHeads =
    start && end ? "both" : start ? "start" : end ? "end" : "none";
  const pageRectButton = new DOMRect(0, 0, 1.5 * L, 1.5 * L);

  // 閉じたときに値を更新する
  const handleClose = (newHeads?: "start" | "end" | "both" | "none") => {
    onClose();
    if (!newHeads) return; // キャンセル時
    if (newHeads === currentHeads) return;
    updateNote(params, { ...params, heads: getHeads(newHeads) });
  };

  /** 1つのアイコンを返す */
  const getIcon = (heads: "start" | "end" | "both" | "none", sx: SxProps) => {
    const line: Arrow | Bracket = {
      type: params.type,
      heads: getHeads(heads),
      ...getVector(params, pageRect, params.type === "Arrow" ? 0.8 : 0.7),
    };
    return (
      <Box
        sx={{
          ...sx,
          background: heads === currentHeads ? red[50] : undefined,
        }}
        onMouseEnter={() => {
          handleClose(heads);
        }}
      >
        <Svg pageRect={pageRectButton}>
          {line.type === "Arrow" ? (
            <ArrowItem pageRect={pageRectButton} params={line} disableNodes />
          ) : (
            <BracketItem pageRect={pageRectButton} params={line} disableNodes />
          )}
        </Svg>
      </Box>
    );
  };

  return (
    params.type === "Arrow"
      ? (["end", "both", "start", "none"] as const)
      : (["both", "start", "none", "end"] as const)
  ).map(
    (h) =>
      ({ sx }: { sx: SxProps }) =>
        getIcon(h, sx)
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
