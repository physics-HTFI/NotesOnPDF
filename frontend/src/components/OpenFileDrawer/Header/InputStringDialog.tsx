import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

/**
 * 文字列を入力するダイアログ
 */
export default function InputStringDialog({
  defaultValue,
  title,
  label,
  onClose,
}: {
  defaultValue?: string;
  title: string;
  label: string;
  onClose: (value?: string) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <Dialog
      open
      onClose={() => {
        onClose();
      }}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="name"
          label={label}
          value={value}
          fullWidth
          variant="standard"
          spellCheck={false}
          onChange={(e) => {
            setValue(decodeURI(e.target.value));
          }}
          inputRef={(ref: HTMLInputElement | undefined) => {
            setTimeout(() => {
              ref?.focus();
            }, 0);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          キャンセル
        </Button>
        <Button
          disabled={!value || value === defaultValue}
          onClick={() => {
            onClose(value);
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
