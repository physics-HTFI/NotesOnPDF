import { useCallback, useEffect, useState } from "react";
import { historyDB } from "./utils/history";

export const useHistory = () => {
  const [folders, setFolders] = useState<FileSystemDirectoryHandle[]>([]);

  // マウント時に、使用されたフォルダの履歴をIndexedDBから読み込む
  useEffect(() => {
    (async () => {
      setFolders(await historyDB.loadAsync());
    })().catch(() => undefined);
  }, []);

  const addAsync = useCallback(async (handle?: FileSystemDirectoryHandle) => {
    if (!handle) return;
    await historyDB.addAsync(handle);
    setFolders(await historyDB.loadAsync());
  }, []);

  const removeAtAsync = useCallback(async (index: number) => {
    await historyDB.removeAtAsync(index);
    setFolders(await historyDB.loadAsync());
  }, []);

  return {
    folders,
    addAsync,
    removeAtAsync,
  };
};
