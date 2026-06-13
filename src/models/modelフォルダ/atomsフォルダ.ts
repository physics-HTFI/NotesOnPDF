import { atom } from "jotai";

export const atomsフォルダ = {
  /** 選択されているルートフォルダ */
  folder: atom<FileSystemDirectoryHandle>(),

  /** ルートフォルダに与えられているパーミッション */
  mode: atom<"read" | "readwrite">(),
};
