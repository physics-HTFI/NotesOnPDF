import { atom, useAtomValue, useSetAtom } from "jotai";

/** 選択されているルートフォルダ */
export const atomFolder = atom<FileSystemDirectoryHandle>();

/** ルートフォルダに与えられているパーミッション */
export const atomMode = atom<"read" | "readwrite">();

const atomReadOnly = atom(
  (get) => get(atomMode) === "read",
  async (get, set, readOnly) => {
    const folder = get(atomFolder);
    if (!folder) return;
    //  パーミッションを取得
    const mode = readOnly ? "read" : "readwrite";
    const result = await folder.requestPermission?.({ mode });
    if (result === "denied") return;
    set(atomMode, mode);
  },
);

const atomReset = atom(null, (_, set) => {
  set(atomFolder, undefined);
  set(atomMode, undefined);
});

//|
//| このフォルダ外からアクセスするもの
//|

export const model起動直後 = {
  /** `atomMode` を boolean で表したもの */
  atomReadOnly,

  /** 選択されているルートフォルダ */
  useFolder: () => useAtomValue(atomFolder),

  /** ルートフォルダの選択を取り消す */
  useReset: () => useSetAtom(atomReset),
};
