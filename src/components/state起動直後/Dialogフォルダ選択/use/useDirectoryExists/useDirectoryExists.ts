import { modelUI } from "@/models/modelUI/modelUI";
import { directoryExistsAsync } from "./directoryExistsAsync";

export function useDirectoryExists() {
  const setAlert = modelUI.alert.useSet();

  const ifExists = async (
    dirHandle: FileSystemDirectoryHandle,
    ifExists: () => void,
  ) => {
    const exists = await directoryExistsAsync(dirHandle);
    if (exists) {
      ifExists();
    } else {
      setAlert("error", `フォルダにアクセスできません："${dirHandle.name}"`);
    }
  };

  return {
    /** フォルダが存在するときにコールバックを実行する */
    ifExists,
  };
}
