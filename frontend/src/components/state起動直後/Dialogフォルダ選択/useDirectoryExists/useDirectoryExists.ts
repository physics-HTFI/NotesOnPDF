import { modelGlobal } from "@/global/modelGlobal";
import { directoryExistsAsync } from "./directoryExistsAsync";
import { useCallback } from "react";

export function useDirectoryExists() {
  const useSetAlert = modelGlobal.alert.useSet();
  const ifExistsAsync = useCallback(
    async (dirHandle: FileSystemDirectoryHandle, ifExists: () => void) => {
      const exists = await directoryExistsAsync(dirHandle);
      if (exists) {
        ifExists();
      } else {
        useSetAlert(
          "error",
          `フォルダにアクセスできません："${dirHandle.name}"`,
        );
      }
    },
    [],
  );

  return {
    /** フォルダが存在するときにコールバックを実行する */
    ifExistsAsync,
  };
}
