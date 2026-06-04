import ModelContext from "@/contexts/ModelContext/ModelContext";
import { useContext } from "react";
import { Dialogフォルダ選択 } from "./Dialogフォルダ選択/Dialogフォルダ選択";
import ModelWeb from "@/models/Model.Web";
import Dialogパーミッション選択 from "./Dialogパーミッション選択/Dialogパーミッション選択";
import { Dialog } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  atomFolder,
  atomSetModeWithPermission,
  atom設定完了value,
  model起動直後,
} from "./model起動直後";

export function Dialog起動直後() {
  const [folder, setFolder] = useAtom(atomFolder);
  const 設定完了 = useAtomValue(atom設定完了value);
  const setModeWithPermission = useSetAtom(atomSetModeWithPermission);
  const reset = model起動直後.useReset();
  const { setModel } = useContext(ModelContext);

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
            setModeWithPermission(mode);
            setModel(new ModelWeb(folder));
          }}
          onCancel={reset}
        />
      )}
    </Dialog>
  );
}
