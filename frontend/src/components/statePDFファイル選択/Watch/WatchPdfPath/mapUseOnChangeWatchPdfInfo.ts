/**
 * PDF の選択パスが変更されたときの処理をここに追加する
 */
export const mapUseOnChangeWatchPdfPath: Map<
  string,
  () => (path?: string) => void
> = new Map();
