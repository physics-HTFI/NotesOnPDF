import ModelContext from "@/contexts/ModelContext/ModelContext";
import { useContext, useState } from "react";
import { Dialogフォルダ選択 } from "./Dialogフォルダ選択/Dialogフォルダ選択";
import UiContext from "@/contexts/UiContext";
import ModelWeb from "@/models/Model.Web";
import Dialogパーミッション選択 from "./Dialogパーミッション選択/Dialogパーミッション選択";
import { Dialog } from "@mui/material";

export function Dialog起動直後() {
  const [folder, setFolder] = useState<FileSystemDirectoryHandle>();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { setModel } = useContext(ModelContext);
  const { setReadOnly } = useContext(UiContext);

  if (folder && isPermissionGranted) return null;

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
            setReadOnly(mode === "read");
            setIsPermissionGranted(true);
            setModel(new ModelWeb(folder));
          }}
          onCancel={() => setFolder(undefined)}
        />
      )}
    </Dialog>
  );
}
