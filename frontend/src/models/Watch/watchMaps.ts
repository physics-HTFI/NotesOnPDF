import type { PdfInfo } from "@/types/PdfInfo";

/**
 * 変数が変更されたときの処理をここに追加する
 */
export const watchMaps = {
  folder: new Map() as CallbackMap<FileSystemDirectoryHandle>,
  pdfPath: new Map() as CallbackMap<string>,
  pdfInfo: new Map() as CallbackMap<PdfInfo>,
};

type CallbackMap<T> = Map<
  string, // コールバックの名称（ホットリロードで複数回カスタムフックが追加されることがあるので、フックが増えてエラーにならないようにする）
  () => (t?: T) => void // 「対象の変数が変更されたときに実行される関数」を返すカスタムフック
>;
