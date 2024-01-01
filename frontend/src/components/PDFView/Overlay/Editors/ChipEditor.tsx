import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Chip as MuiChip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Chip, Notes } from "@/types/Notes";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";

/**
 * `notes`に含まれているチップ注釈のうち、出現回数が多い順に並べ替えて返す。
 */
const getOptions = (notes?: Notes): string[] => {
  if (!notes) return [];
  const counts: Record<string, number> = {};
  for (const page of Object.values(notes.pages)) {
    if (!page.notes) continue;
    for (const n of page.notes) {
      if (n.type !== "Chip") continue;
      counts[n.text] = 1 + (counts[n.text] ?? 0);
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map((a) => a[0]);
};

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
  const { notes, update } = useNotes();
  const [type, setType] = useState(
    params.outlined ?? false ? "outlined" : "filled"
  );
  const [rawText, setRawText] = useState(params.text);
  const [open, setOpen] = useState(false);
  const options = useMemo(() => getOptions(notes), [notes]);

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
    <EditorBase onClose={handleClose}>
      <Autocomplete
        freeSolo
        open={open}
        options={options}
        sx={{ p: 1, width: "200px" }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            inputRef={(ref?: HTMLInputElement) => {
              ref?.focus();
            }}
          />
        )}
        inputValue={rawText}
        onInputChange={(_, text) => {
          setRawText(text);
          setOpen(text === "");
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
        color="info"
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
