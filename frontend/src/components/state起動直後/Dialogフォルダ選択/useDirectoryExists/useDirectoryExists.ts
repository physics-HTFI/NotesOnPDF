import { modelGlobal } from "@/global/modelGlobal";
import { directoryExistsAsync } from "./directoryExistsAsync";

export function useDirectoryExists() {
  const useSetAlert = modelGlobal.alert.useSet();

  return {
    /** フォルダが存在するときにコールバックを実行する */
    ifExistsAsync: async (
      dirHandle: FileSystemDirectoryHandle,
      ifExists: () => void,
    ) => {
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
  };
}
