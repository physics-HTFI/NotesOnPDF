import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Rect, Polygon } from "@/types/PdfNotes";
import EditorBase from "./EditorBase";
import Svg from "../../common/Svg";
import RectSvg from "../Items/Rect";
import { red } from "@mui/material/colors";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { useContext } from "react";

/**
 * 直方体、ポリゴンの編集ダイアログ
 */
export default function RectEditor({
  params,
  onClose,
}: {
  params: Polygon | Rect;
  onClose: () => void;
}) {
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
            <RectSvg pageRect={pageRect} params={rect} disableNodes />
          </Svg>
        </ToggleButton>
        <ToggleButton value="outlined" sx={toggleSx}>
          <Svg pageRect={pageRect}>
            <RectSvg
              pageRect={pageRect}
              params={{ ...rect, style: "outlined" }}
              disableNodes
            />
          </Svg>
        </ToggleButton>
      </ToggleButtonGroup>
    </EditorBase>
  );
}
