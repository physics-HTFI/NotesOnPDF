/**
 * `dirHandle` からの相対パス `path` を用いてファイルハンドルを取得する。
 * 例：`path = "path/to/file.txt"`。
 * 失敗時は `undefined` が返る。
 */
export async function getFileFromPath(
  path: string | undefined,
  dirHandle: FileSystemDirectoryHandle | undefined,
  create: boolean,
): Promise<FileSystemFileHandle | undefined> {
  try {
    if (!path || !dirHandle) return undefined;
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
