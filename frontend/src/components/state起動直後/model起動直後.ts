import { atom, useSetAtom } from "jotai";

const atomFolder = atom<FileSystemDirectoryHandle>();
const atomMode = atom<"read" | "readwrite">();
const atomReset = atom(null, (_, set) => {
  set(atomFolder, undefined);
  set(atomMode, undefined);
});

export const model起動直後 = {
  /** 選択されたルートフォルダ */
  atomFolder,
  /** ルートフォルダに与えられたパーミッション */
  atomMode,
  /** ルートフォルダの選択を取り消す */
  useReset: () => useSetAtom(atomReset),
};
