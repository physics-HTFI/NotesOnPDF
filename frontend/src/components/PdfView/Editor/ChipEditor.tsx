import { FC, useMemo, useState } from "react";
import {
  Autocomplete,
  Chip as MuiChip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Chip, PdfNotes } from "@/types/PdfNotes";
import usePdfNotes from "@/hooks/usePdfNotes";
import EditorBase from "./EditorBase";
import { blue } from "@mui/material/colors";

/**
 * `pdfNotes`に含まれているチップ注釈のうち、出現回数が多い順に並べ替えて返す。
 */
const getOptions = (pdfNotes?: PdfNotes): string[] => {
  if (!pdfNotes) return [];
  const counts: Record<string, number> = {};
  for (const page of Object.values(pdfNotes.pages)) {
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
  const { pdfNotes, updateNote } = usePdfNotes();
  const [style, setStyle] = useState(params.style);
  const [rawText, setRawText] = useState(params.text);
  const [open, setOpen] = useState(params.text === "");
  const options = useMemo(() => getOptions(pdfNotes), [pdfNotes]);

  // 閉じたときに値を更新する
  const handleClose = (newText?: string) => {
    onClose();
    const text = newText ?? rawText.trim();
    if (style === params.style && text === params.text) return;
    if (text === "") return;
    updateNote(params, { ...params, style, text });
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
            onFocus={(e) => {
              e.target.select();
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
        value={style}
        sx={{ pl: 1 }}
        size="small"
        exclusive
        onChange={(_, style: string | null) => {
          if (!style || (style !== "filled" && style !== "outlined")) return;
          setStyle(style);
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
