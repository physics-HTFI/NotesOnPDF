import ModelContext from "@/contexts/ModelContext/ModelContext";
import { useContext } from "react";
import { Dialogフォルダ選択 } from "./Dialogフォルダ選択/Dialogフォルダ選択";
import UiContext from "@/contexts/UiContext";
import ModelWeb from "@/models/Model.Web";
import Dialogパーミッション選択 from "./Dialogパーミッション選択/Dialogパーミッション選択";
import { Dialog } from "@mui/material";
import { useAtom } from "jotai";
import { model起動直後 } from "./model起動直後";

export function Dialog起動直後() {
  const [folder, setFolder] = useAtom(model起動直後.atomFolder);
  const [mode, setMode] = useAtom(model起動直後.atomMode);
  const { setModel } = useContext(ModelContext);
  const { setReadOnly } = useContext(UiContext);

  const 設定完了 = folder && mode;
  if (設定完了) return null;

  // <Dialog> を括り出しておかないと、切り替え時に画面が一瞬白くなる
  return (
    <Dialog open>
      {!folder ? (
        <Dialogフォルダ選択 onSelect={setFolder} />
      ) : (
        <Dialogパーミッション選択
          folder={folder}
          onPermissionSelected={(mode) => {
            if (mode === "denied") return;
            setMode(mode);
            setReadOnly(mode === "read");
            setModel(new ModelWeb(folder));
          }}
          onCancel={() => setFolder(undefined)}
        />
      )}
    </Dialog>
  );
}
