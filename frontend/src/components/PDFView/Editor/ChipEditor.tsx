import { FC, useMemo, useState } from "react";
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
import { blue } from "@mui/material/colors";

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
const ChipEditor: FC<Props> = ({ params, onClose }) => {
  const { notes, updateNote } = useNotes();
  const [type, setType] = useState(
    params.outlined ?? false ? "outlined" : "filled"
  );
  const [rawText, setRawText] = useState(params.text);
  const [open, setOpen] = useState(params.text === "");
  const options = useMemo(() => getOptions(notes), [notes]);

  // 閉じたときに値を更新する
  const handleClose = (newText?: string) => {
    onClose();
    const outlined = type === "outlined" ? true : undefined;
    const text = newText ?? rawText.trim();
    if (outlined === params.outlined && text === params.text) return;
    if (text === "") return;
    updateNote(params, { ...params, outlined, text });
  };

  const toggleSx = {
    "&.Mui-selected, &.Mui-selected:hover": {
      background: blue[50],
    },
  };
  return (
    <EditorBase onClose={handleClose}>
      <Autocomplete
        freeSolo
        open={open}
        options={options}
        sx={{ width: "200px" }}
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
        onInputChange={(_, value) => {
          // この関数はテキストボックスが変更されたときに呼ばれる
          setRawText(value);
          setOpen(value === "");
        }}
        onChange={(_, value, reason) => {
          // この関数は選択されたときに呼ばれる
          if (value && reason === "selectOption") handleClose(value);
        }}
      />
      <ToggleButtonGroup
        value={type}
        sx={{ pl: 1 }}
        size="small"
        exclusive
        onChange={(_, newType: string | null) => {
          if (!newType) return;
          setType(newType);
        }}
      >
        <ToggleButton value="filled" sx={toggleSx}>
          <MuiChip color="primary" variant="filled" size="small" label="abc" />
        </ToggleButton>
        <ToggleButton value="outlined" sx={toggleSx}>
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
