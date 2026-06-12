import { modelUI } from "@/models/modelUI";
import { Alert as MuiAlert, Snackbar } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

/**
 * エラー・情報をスナックバーで表示する
 */
export function Alert() {
  const alert = useAtomValue(modelUI.alert.atom);
  const clear = useSetAtom(modelUI.alert.atomClear);

  // `alert === undefined` になった瞬間に（スナックバーが消える前に）空白表示されないように、メッセージを残しておく
  const [currentAlert, setCurrentAlert] = useState<typeof alert>();
  if (alert && currentAlert !== alert) setCurrentAlert(alert);

  return (
    <Snackbar open={!!alert} onClose={clear} autoHideDuration={5000}>
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={currentAlert?.severity}
        onClose={clear}
        sx={{ width: "100%" }}
      >
        {currentAlert?.message}
      </MuiAlert>
    </Snackbar>
  );
}
