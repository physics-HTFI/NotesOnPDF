/**
 * 選択フォルダが変更されたときの処理をここに追加する
 */
export const mapUseOnChangeWatchFolder: Map<
  string,
  () => (folder?: FileSystemDirectoryHandle) => void
> = new Map();
