import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

/**
 * `SnackbarsMock`の`Props`
 */
interface Props {
  open: boolean;
}

/**
 * モックモデルを使用していることを示すポップアップ表示
 */
const SnackbarsMock: React.FC<Props> = ({ open }) => {
  const [openLocal, setOpenLocal] = React.useState(open);

  const handleClose = () => {
    setOpenLocal(false);
  };

  return (
    <Snackbar open={openLocal} onClose={handleClose}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity="warning"
        sx={{ width: "100%" }}
      >
        これはデモページです。
        <br />
        編集などは一通りできますが保存はされません。
        <br />
        再読み込みすると元に戻ります。
      </Alert>
    </Snackbar>
  );
};

export default SnackbarsMock;
