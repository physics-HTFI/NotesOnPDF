/**
 * フォルダにアクセスできれば true、できなければ false
 */
export async function directoryExistsAsync(
  dirHandle: FileSystemDirectoryHandle,
) {
  try {
    await dirHandle.requestPermission?.({ mode: "read" }); // これがないと存在していても失敗することがある
    const iter = dirHandle.entries();
    await iter.next(); // ここで例外が飛ぶ
    return true;
  } catch (e) {
    return false;
  }
}
