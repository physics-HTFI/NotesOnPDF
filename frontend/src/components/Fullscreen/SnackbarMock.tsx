import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

/**
 * モックモデルを使用していることを示すポップアップ表示
 */
export default function SnackbarsMock() {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity="info"
        sx={{ width: "100%" }}
      >
        これはデモページです。
        <br />
        一部の機能は使用できません。
        <br />
        編集などは一通りできますが、保存はされません。
        <br />
        再読み込みすると元に戻ります。
      </Alert>
    </Snackbar>
  );
}
