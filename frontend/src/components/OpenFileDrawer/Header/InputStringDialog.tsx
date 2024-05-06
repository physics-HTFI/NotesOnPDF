import { FC, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

/**
 * `InputStringDialog`の引数
 */
interface Props {
  defaultValue?: string;
  title: string;
  label: string;
  onClose: (value?: string) => void;
}

/**
 * 文字列を入力するダイアログ
 */
const InputStringDialog: FC<Props> = ({
  defaultValue,
  title,
  label,
  onClose,
}) => {
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
};

export default InputStringDialog;
