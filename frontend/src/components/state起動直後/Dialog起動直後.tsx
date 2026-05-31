import ModelContext from "@/contexts/ModelContext/ModelContext";
import { useContext, useState } from "react";
import { Dialogフォルダ選択 } from "./Dialogフォルダ選択/Dialogフォルダ選択";
import UiContext from "@/contexts/UiContext";
import ModelWeb from "@/models/Model.Web";
import Dialogパーミッション選択 from "./Dialogパーミッション選択/Dialogパーミッション選択";

export function Dialog起動直後() {
  const [folder, setFolder] = useState<FileSystemDirectoryHandle>();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { setModel } = useContext(ModelContext);
  const { setReadOnly } = useContext(UiContext);

  if (!folder) {
    return <Dialogフォルダ選択 onSelect={setFolder} />;
  } else if (!isPermissionGranted) {
    return (
      <Dialogパーミッション選択
        folder={folder}
        onPermissionSelected={(mode) => {
          if (mode === "readwrite") {
            setReadOnly(false);
          } else if (mode === "read") {
            setReadOnly(true);
          } else {
            setFolder(undefined);
            return;
          }

          setModel(new ModelWeb(folder));
          setIsPermissionGranted(true);
        }}
      />
    );
  }
  return null;
}
