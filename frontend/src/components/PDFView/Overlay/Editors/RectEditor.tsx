import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Rect, Polygon } from "@/types/Notes";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";
import Svg from "../Svg";
import RectSvg from "../Rect";
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
const RectEditor: React.FC<Props> = ({ params, onClose }) => {
  const { update } = useNotes();
  const [type, setType] = useState(
    params.border ?? false ? "border" : "filled"
  );

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    const border = type === "border" ? true : undefined;
    if (border === params.border) return;
    update(params, { ...params, border });
  };

  const size = 50;
  const pageRect = new DOMRect(0, 0, size, size);
  const rect: Rect = {
    type: "Rect",
    x: 0.2,
    y: 0.3,
    width: 0.6,
    height: 0.4,
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
        value={type}
        exclusive
        size="small"
        sx={{ m: 1, "& *:focus": { outline: "none" } }}
        onChange={(_, newType: string | null) => {
          if (!newType) return;
          setType(newType);
        }}
      >
        <ToggleButton value="filled" sx={toggleSx}>
          <Svg pageRect={pageRect}>
            <RectSvg
              pageRect={pageRect}
              params={rect}
              mode={null}
              onDelete={() => undefined}
              onEdit={() => undefined}
            />
          </Svg>
        </ToggleButton>
        <ToggleButton value="border" sx={toggleSx}>
          <Svg pageRect={pageRect}>
            <RectSvg
              pageRect={pageRect}
              params={{ ...rect, border: true }}
              mode={null}
              onDelete={() => undefined}
              onEdit={() => undefined}
            />
          </Svg>
        </ToggleButton>
      </ToggleButtonGroup>
    </EditorBase>
  );
};

export default RectEditor;
