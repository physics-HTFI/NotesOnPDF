import { modelGlobal } from "@/global/modelGlobal";
import { directoryExistsAsync } from "./directoryExistsAsync";
import { useCallback } from "react";

export function useDirectoryExists() {
  const setAlert = modelGlobal.alert.useSet();

  const ifExists = useCallback(
    async (dirHandle: FileSystemDirectoryHandle, ifExists: () => void) => {
      const exists = await directoryExistsAsync(dirHandle);
      if (exists) {
        ifExists();
      } else {
        setAlert("error", `フォルダにアクセスできません："${dirHandle.name}"`);
      }
    },
    [setAlert],
  );

  return {
    /** フォルダが存在するときにコールバックを実行する */
    ifExists,
  };
}
