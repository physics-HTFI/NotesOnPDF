import { modelGlobal } from "@/global/modelGlobal";
import { directoryExistsAsync } from "./directoryExistsAsync";

export function useDirectoryExists() {
  const setAlert = modelGlobal.alert.useSet();

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
