import { FC } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Rect, Polygon } from "@/types/PdfNotes";
import { usePdfNotes } from "@/hooks/usePdfNotes";
import EditorBase from "./EditorBase";
import Svg from "../Items/Svg";
import RectSvg from "../Items/Rect";
import { red } from "@mui/material/colors";

/**
 * `RectEditor`の引数
 */
interface Props {
  params: Polygon | Rect;
  onClose: () => void;
}

/**
 * 直方体、ポリゴンの編集ダイアログ
 */
const RectEditor: FC<Props> = ({ params, onClose }) => {
  const { updateNote } = usePdfNotes();

  // 閉じたときに値を更新する
  const handleClose = (style?: "outlined" | "filled") => {
    onClose();
    if (!style) return; // キャンセル時
    if (style === params.style) return;
    updateNote(params, { ...params, style });
  };

  const size = 50;
  const pageRect = new DOMRect(0, 0, size, size);
  const rect: Rect = {
    type: "Rect",
    x: 0.2,
    y: 0.3,
    width: 0.6,
    height: 0.4,
    style: "filled",
  };
  const toggleSx = {
    width: size,
    height: size,
    "&.Mui-selected, &.Mui-selected:hover": {
      background: red[50],
    },
  };
  return (
    <EditorBase onClose={handleClose}>
      <ToggleButtonGroup
        value={params.style}
        exclusive
        size="small"
        sx={{ "& *:focus": { outline: "none" } }}
        onChange={(_, style: string | null) => {
          if (style === "outlined" || style === "filled") {
            handleClose(style);
          }
        }}
      >
        <ToggleButton value="filled" sx={toggleSx}>
          <Svg pageRect={pageRect}>
            <RectSvg pageRect={pageRect} params={rect} />
          </Svg>
        </ToggleButton>
        <ToggleButton value="outlined" sx={toggleSx}>
          <Svg pageRect={pageRect}>
            <RectSvg
              pageRect={pageRect}
              params={{ ...rect, style: "outlined" }}
            />
          </Svg>
        </ToggleButton>
      </ToggleButtonGroup>
    </EditorBase>
  );
};

export default RectEditor;
