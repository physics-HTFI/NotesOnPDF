import { Box, SxProps } from "@mui/material";
import { Rect, Polygon } from "@/types/PdfNotes";
import Svg from "../../common/Svg";
import RectSvg from "../Items/Rect";
import { red } from "@mui/material/colors";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { useContext } from "react";

/**
 * 直方体、ポリゴンの編集ダイアログのアイコン
 */
export default function RectEditorIcon(
  L: number,
  params: Polygon | Rect,
  onClose: () => void
) {
  const {
    updaters: { updateNote },
  } = useContext(PdfNotesContext);

  // 閉じたときに値を更新する
  const handleClose = (style?: "outlined" | "filled") => {
    onClose();
    if (!style) return; // キャンセル時
    if (style === params.style) return;
    updateNote(params, { ...params, style });
  };

  const pageRectButton = new DOMRect(0, 0, L, L);

  /** 1つのアイコンを返す */
  const getIcon = (style: "outlined" | "filled", sx: SxProps) => {
    const rect: Rect = {
      type: "Rect",
      x: 0.2,
      y: 0.3,
      width: 0.6,
      height: 0.4,
      style,
    };
    return (
      <Box
        sx={{
          ...sx,
          background: style === params.style ? red[50] : undefined,
        }}
        onMouseEnter={() => {
          handleClose(style);
        }}
      >
        <Svg pageRect={pageRectButton}>
          <RectSvg pageRect={pageRectButton} params={rect} disableNodes />
        </Svg>
      </Box>
    );
  };

  return (["outlined", "filled"] as const).map(
    (h) =>
      ({ sx }: { sx: SxProps }) =>
        getIcon(h, sx)
  );
}
