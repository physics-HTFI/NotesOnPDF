import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

/**
 * `OpenURLDialog`の引数
 */
interface Props {
  open: boolean;
  onClose: (url?: string) => void;
}

/**
 * URLを指定するダイアログ
 */
const OpenURLDialog: React.FC<Props> = ({ open, onClose }) => {
  const [url, setURL] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setURL("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      fullWidth
    >
      <DialogTitle>URLからPDFファイルを開く</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="name"
          label="URL"
          value={url}
          type="email"
          fullWidth
          variant="standard"
          onChange={(e) => {
            const url = e.target.value;
            setURL(url);
            setDisabled(!url);
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
          disabled={disabled}
          onClick={() => {
            onClose(url);
          }}
        >
          開く
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenURLDialog;
