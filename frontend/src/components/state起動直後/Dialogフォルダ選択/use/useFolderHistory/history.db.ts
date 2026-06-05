import { type DBSchema, openDB } from "idb";

const DB_NAME = "history-db";
const STORE_NAME = "history-store";
const KEY_NAME = "history";
const DB_VERSION = 1;
const MAX_HISTORY = 10;

/**
 * 履歴の取得、追加、削除を行う
 */
export const historyDB = {
  add: addFolderToHistory,
  load: loadHistory,
  removeAt: removeHistoryAt,
};

//|
//| private
//|

interface HistoryDB extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: FileSystemDirectoryHandle[];
  };
}

async function getDB() {
  return await openDB<HistoryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

/**
 * `handle` をヒストリーに追加して保存する。
 */
async function addFolderToHistory(
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  // 保存されているハンドルを読み込む
  const handles = await loadHistory();
  // すでに同じハンドルがあれば削除
  const dups = await Promise.all(handles.map((h) => h.isSameEntry(handle)));
  const filteredHandles = handles.filter((_, i) => !dups[i]);
  // 先頭に新しいハンドルを追加し、最大数を超える場合は古いものを削除
  const newHandles = [handle, ...filteredHandles].slice(0, MAX_HISTORY);

  await saveHistory(newHandles);
}

/**
 * ヒストリーを削除する。
 */
async function removeHistoryAt(index: number): Promise<void> {
  const handles = await loadHistory();
  handles.splice(index, 1);
  await saveHistory(handles);
}

/**
 * ヒストリーを保存する。
 */
async function saveHistory(
  history: FileSystemDirectoryHandle[],
): Promise<void> {
  if (!("indexedDB" in window)) return;
  try {
    const db = await getDB();
    await db.put(STORE_NAME, history, KEY_NAME);
  } catch (err) {
    console.error("saveFolder: failed to store handle", err);
  }
}

/**
 * ヒストリーを返す。
 * 失敗した場合は空の配列を返す。
 */
async function loadHistory(): Promise<FileSystemDirectoryHandle[]> {
  if (!("indexedDB" in window)) return [];
  try {
    const db = await getDB();
    const handle = await db.get(STORE_NAME, KEY_NAME);
    return handle || [];
  } catch (err) {
    console.error("loadHistory: failed to read handle", err);
    return [];
  }
}
