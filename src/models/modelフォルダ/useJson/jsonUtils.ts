export const jsonUtils = {
  /** 失敗時は `undefined` が返る */
  read: readJson,

  /** 失敗時は `false` が返る */
  write: writeJson,
};

///|
///| private
///|

//|
//| read
//|

/**
 *  失敗時は `undefined` が返る
 */
async function readJson<T>(
  fileHandle: FileSystemFileHandle | undefined,
): Promise<T | undefined> {
  try {
    if (!fileHandle) return;
    const text = await readText(fileHandle);
    if (text === undefined) return undefined;
    return JSON.parse(text) as T; // 失敗したら throw
  } catch (_) {
    return undefined;
  }
}

/**
 *  失敗時は `undefined` が返る
 */
async function readText(
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
 *  `digit` が設定されているときは、小数点以下 `digit` 桁だけ出力する。
 *  失敗時は `false` が返る。
 */
async function writeJson(
  object: unknown | undefined,
  fileHandle: FileSystemFileHandle | undefined,
  digits?: number,
): Promise<boolean> {
  if (object === undefined || !fileHandle) return false;
  let json = JSON.stringify(object);
  if (digits && digits > 0) {
    const regexp = new RegExp(`(\\d\\.\\d{${digits}})\\d*`, "g"); // replaceAll は、"g" がないと TypeError
    json = json.replaceAll(regexp, "$1");
  }
  return writeText(json, fileHandle);
}

/**
 *  失敗時は `false` が返る
 */
async function writeText(
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
