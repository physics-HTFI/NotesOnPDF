/**
 * フォルダにアクセスできれば true、できなければ false
 */
export async function directoryExistsAsync(
  dirHandle: FileSystemDirectoryHandle,
) {
  try {
    const iter = dirHandle.entries();
    await iter.next(); // ここで例外が飛ぶ
    return true;
  } catch (e) {
    return false;
  }
}
