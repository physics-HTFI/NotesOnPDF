import { useSyncExternalStore } from "react";
import { historyDB } from "./history.db";

export function useFolderHistory() {
  const folders = useSyncExternalStore(subscribe, getSnapshot);

  return {
    /** 履歴フォルダハンドル */
    folders,
    /** フォルダハンドルを追加する */
    add,
    /** 指定された位置のフォルダハンドルを削除する */
    removeAt,
  };
}

//|
//| private
//|

let folders: FileSystemDirectoryHandle[] = await historyDB.load();
let callbacks: Callback[] = [];
type Callback = () => void;

async function emitChange() {
  folders = await historyDB.load(); // folders を変更したうえで callback を呼ばないとリレンダーされない
  for (const callback of callbacks) {
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

async function add(folder: FileSystemDirectoryHandle) {
  await historyDB.add(folder);
  await emitChange();
}

async function removeAt(index: number) {
  await historyDB.removeAt(index);
  await emitChange();
}
