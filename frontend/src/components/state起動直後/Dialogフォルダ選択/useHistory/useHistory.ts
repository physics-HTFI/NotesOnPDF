import { useSyncExternalStore } from "react";
import { historyDB } from "./history.db";

//|
//| export
//|

export function useHistory() {
  const folders = useSyncExternalStore(subscribe, getSnapshot);

  return {
    /** 履歴フォルダハンドル */
    folders,
    /** フォルダハンドルを追加する */
    addAsync,
    /** 指定された位置のフォルダハンドルを削除する */
    removeAtAsync,
  };
}

//|
//| local
//|

let folders: FileSystemDirectoryHandle[] = await historyDB.loadAsync();
let callbacks: Callback[] = [];
type Callback = () => void;

async function emitChange() {
  folders = await historyDB.loadAsync(); // folders を変更したうえで callback を呼ばないとリレンダーされない
  for (let callback of callbacks) {
    callback();
  }
}

function subscribe(callback: Callback) {
  callbacks.push(callback);
  return () => (callbacks = callbacks.filter((c) => c != callback));
}

function getSnapshot() {
  return folders;
}

async function addAsync(folder: FileSystemDirectoryHandle) {
  await historyDB.addAsync(folder);
  await emitChange();
}

async function removeAtAsync(index: number) {
  await historyDB.removeAtAsync(index);
  await emitChange();
}
