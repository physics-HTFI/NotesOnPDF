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
  addAsync: addFolderToHistoryAsync,
  loadAsync: loadHistoryAsync,
  removeAtAsync: removeHistoryAtAsync,
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
  // eslint-disable-next-line
  return await openDB<HistoryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // eslint-disable-next-line
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // eslint-disable-next-line
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

/**
 * `handle` をヒストリーに追加して保存する。
 */
async function addFolderToHistoryAsync(
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  // 保存されているハンドルを読み込む
  const handles = await loadHistoryAsync();
  // すでに同じハンドルがあれば削除
  const dups = await Promise.all(handles.map((h) => h.isSameEntry(handle)));
  const filteredHandles = handles.filter((_, i) => !dups[i]);
  // 先頭に新しいハンドルを追加し、最大数を超える場合は古いものを削除
  const newHandles = [handle, ...filteredHandles].slice(0, MAX_HISTORY);

  await saveHistoryAsync(newHandles);
}

/**
 * ヒストリーを削除する。
 */
async function removeHistoryAtAsync(index: number): Promise<void> {
  const handles = await loadHistoryAsync();
  handles.splice(index, 1);
  await saveHistoryAsync(handles);
}

/**
 * ヒストリーを保存する。
 */
async function saveHistoryAsync(
  history: FileSystemDirectoryHandle[],
): Promise<void> {
  if (!("indexedDB" in window)) return;
  try {
    const db = await getDB(); // eslint-disable-line
    await db.put(STORE_NAME, history, KEY_NAME); // eslint-disable-line
  } catch (err) {
    console.error("saveFolder: failed to store handle", err);
  }
}

/**
 * ヒストリーを返す。
 * 失敗した場合は空の配列を返す。
 */
async function loadHistoryAsync(): Promise<FileSystemDirectoryHandle[]> {
  if (!("indexedDB" in window)) return [];
  try {
    const db = await getDB(); // eslint-disable-line
    const handle = await db.get(STORE_NAME, KEY_NAME); // eslint-disable-line
    return handle || []; // eslint-disable-line
  } catch (err) {
    console.error("loadHistory: failed to read handle", err);
    return [];
  }
}
