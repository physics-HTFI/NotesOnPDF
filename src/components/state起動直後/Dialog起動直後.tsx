import { Dialogフォルダ選択 } from "./Dialogフォルダ選択/Dialogフォルダ選択";
import Dialogパーミッション選択 from "./Dialogパーミッション選択/Dialogパーミッション選択";
import { Dialog } from "@mui/material";
import { modelフォルダ } from "../../models/modelフォルダ/modelフォルダ";

export function Dialog起動直後() {
  const 設定完了 = modelフォルダ.folder.useIs選択完了Value();

  // <Dialog> を括り出しておかないと、切り替え時に画面が一瞬白くなる
  return (
    <>
      {設定完了 || (
        <Dialog open>
          <Dialogフォルダ選択 />
          <Dialogパーミッション選択 />
        </Dialog>
      )}
    </>
  );
}
