/**
 * 変数が変更されたときの処理をここに追加する
 */
export const watchMaps = {
  folder: new Map() as CallbackMap<FileSystemDirectoryHandle>,
  pdfPath: new Map() as CallbackMap<string>,
};

type CallbackMap<T> = Map<
  string, // コールバックの名称（ホットリロード時にカスタムフックが重複して追加されるのを防ぐ。そうしないとフックが増えてエラーになる。）
  () => (t?: T) => void // 「対象の変数が変更されたときに実行される関数」を返すカスタムフック
>;
