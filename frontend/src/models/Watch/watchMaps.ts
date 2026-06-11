import type PdfNotes from "@/types/PdfNotes";

/**
 * 変数が変更されたときの処理をここに追加する
 */
export const watchMaps = {
  folder: new Map() as CallbackMap<FileSystemDirectoryHandle>,
  pdfPath: new Map() as CallbackMap<string>,
  pdfNotes: new Map() as CallbackMap<PdfNotes>,
  pdfLoaded: new Map() as CallbackMap<boolean>,
  pdfFullLoaded: new Map() as CallbackMap<boolean>,
  currentPage: new Map() as CallbackMap<number>,
};

type CallbackMap<T> = Map<
  string, // コールバックの名称（ホットリロード時にカスタムフックが重複して追加されるのを防ぐ。そうしないとフックが増えてエラーになる。）
  () => (t?: T) => void // 「対象の変数が変更されたときに実行される関数」を返すカスタムフック
>;
