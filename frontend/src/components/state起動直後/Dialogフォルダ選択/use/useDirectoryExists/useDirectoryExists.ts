import { modelUi } from "@/components/global/modelUi";
import { directoryExistsAsync } from "./directoryExistsAsync";

export function useDirectoryExists() {
  const setAlert = modelUi.alert.useSet();

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
