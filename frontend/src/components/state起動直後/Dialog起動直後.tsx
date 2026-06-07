import { Dialogフォルダ選択 } from "./Dialogフォルダ選択/Dialogフォルダ選択";
import Dialogパーミッション選択 from "./Dialogパーミッション選択/Dialogパーミッション選択";
import { Dialog } from "@mui/material";
import { useAtomValue } from "jotai";
import { modelフォルダ } from "../../models/modelフォルダ";
import { WatchFolder } from "../../models/Watch/WatchFolder/WatchFolder";

export function Dialog起動直後() {
  const 設定完了 = useAtomValue(modelフォルダ.準備完了.atomValue);

  // <Dialog> を括り出しておかないと、切り替え時に画面が一瞬白くなる
  return (
    <>
      {設定完了 || (
        <Dialog open>
          <Dialogフォルダ選択 />
          <Dialogパーミッション選択 />
        </Dialog>
      )}
      <WatchFolder />
    </>
  );
}
