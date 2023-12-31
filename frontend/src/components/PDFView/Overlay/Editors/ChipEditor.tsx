import React, { useState } from "react";
import {
  Chip as MuiChip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Chip } from "@/types/Notes";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";

/**
 * `ChipEditor`の引数
 */
interface Props {
  params: Chip;
  onClose: () => void;
}

/**
 * チップの編集ダイアログ
 */
const ChipEditor: React.FC<Props> = ({ params, onClose }) => {
  const { update } = useNotes();
  const [type, setType] = useState(
    params.outlined ?? false ? "outlined" : "filled"
  );
  const [rawText, setRawText] = useState(params.text);

  // TODO 使用されているテキストのリストを表示する

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    const outlined = type === "outlined" ? true : undefined;
    const text = rawText.trim();
    if (outlined === params.outlined && text === params.text) return;
    if (text === "") return;
    update(params, { ...params, outlined, text });
  };

  return (
    <EditorBase width={350} height={60} onClose={handleClose}>
      <TextField
        variant="standard"
        value={rawText}
        sx={{ p: 1 }}
        inputRef={(ref?: HTMLInputElement) => {
          ref?.focus();
        }}
        onChange={(e) => {
          setRawText(e.target.value);
        }}
      />
      <ToggleButtonGroup
        value={type}
        sx={{ p: 1 }}
        size="small"
        exclusive
        onChange={(_, newType: string | null) => {
          if (!newType) return;
          setType(newType);
        }}
      >
        <ToggleButton value="filled">
          <MuiChip color="primary" variant="filled" size="small" label="abc" />
        </ToggleButton>
        <ToggleButton value="outlined">
          <MuiChip
            color="primary"
            variant="outlined"
            size="small"
            label="abc"
          />
        </ToggleButton>
      </ToggleButtonGroup>
    </EditorBase>
  );
};

export default ChipEditor;
