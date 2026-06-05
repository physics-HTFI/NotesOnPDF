export const fileUtils = {
  /** 失敗時は `undefined` が返る */
  readJsonFromPathAsync,

  /** 失敗時は `false` が返る */
  writeJsonToPathAsync,
};

//|
//| private
//|

/**
 * `dirHandle` からの相対パス `path` を用いてファイルハンドルを取得する。
 * 例：`path = "path/to/file.txt"`。
 * 失敗時は `undefined` が返る。
 */
async function getFileHandleFromPath(
  path: string,
  dirHandle: FileSystemDirectoryHandle,
  create: boolean,
): Promise<FileSystemFileHandle | undefined> {
  try {
    const dirs = path.split(/[/\\]/);
    const file = dirs.pop();
    if (!file) return undefined;
    let handle = dirHandle;
    for (const dir of dirs) {
      handle = await handle.getDirectoryHandle(dir, { create });
    }
    return await handle.getFileHandle(file, { create });
  } catch (_) {
    return undefined;
  }
}

//|
//| read
//|

/**
 *  失敗時は `undefined` が返る
 */
async function readJsonFromPathAsync<T>(
  path: string,
  dirHandle: FileSystemDirectoryHandle | undefined,
): Promise<T | undefined> {
  if (!dirHandle) return undefined;
  const text = await readTextFromPathAsync(path, dirHandle);
  if (text === undefined) return undefined;
  try {
    return JSON.parse(text) as T; // 失敗したら throw
  } catch (_) {
    return undefined;
  }
}

/**
 *  失敗時は `undefined` が返る
 */
async function readTextFromPathAsync(
  path: string,
  dirHandle: FileSystemDirectoryHandle,
): Promise<string | undefined> {
  const file = await getFileHandleFromPath(path, dirHandle, false);
  if (!file) return undefined;
  return readTextAsync(file);
}

/**
 *  失敗時は `undefined` が返る
 */
async function readTextAsync(
  fileHandle: FileSystemFileHandle,
): Promise<string | undefined> {
  try {
    const file = await fileHandle.getFile();
    const promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
    const text = await promise;
    return text;
  } catch (_) {
    return undefined;
  }
}

//|
//| write
//|

/**
 *  失敗時は `false` が返る
 */
async function writeJsonToPathAsync(
  object: unknown | undefined,
  path: string,
  dirHandle: FileSystemDirectoryHandle | undefined,
): Promise<boolean> {
  if (object === undefined || !dirHandle) return false;
  return writeTextToPathAsync(JSON.stringify(object), path, dirHandle);
}

/**
 *  失敗時は `false` が返る
 */
async function writeTextToPathAsync(
  text: string,
  path: string,
  dirHandle: FileSystemDirectoryHandle,
): Promise<boolean> {
  const file = await getFileHandleFromPath(path, dirHandle, true);
  if (!file) return false;
  return writeTextAsync(text, file);
}

/**
 *  失敗時は `false` が返る
 */
async function writeTextAsync(
  text: string,
  fileHandle: FileSystemFileHandle,
): Promise<boolean> {
  try {
    const file = await fileHandle.createWritable();
    await file.write(text);
    await file.close();
    return true;
  } catch (_) {
    return false;
  }
}
