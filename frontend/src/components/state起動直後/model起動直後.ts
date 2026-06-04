import { atom, useAtomValue, useSetAtom } from "jotai";

//|
//| atom
//|

/** 選択されているルートフォルダ */
export const atomFolder = atom<FileSystemDirectoryHandle>();

/** ルートフォルダに与えられているパーミッション */
const atomMode = atom<"read" | "readwrite">();

//|
//| 派生 atom
//|

export const atom設定完了value = atom(
  (get) => !!get(atomFolder) && !!get(atomMode),
);

/** ルートフォルダにパーミッションを設定する */
export const atomSetModeWithPermission = atom(
  null,
  async (get, set, mode: "read" | "readwrite") => {
    const folder = get(atomFolder);
    if (!folder) return;
    const result = await folder.requestPermission?.({ mode });
    if (result && result !== "granted") return; // requestPermission がないブラウザは通過させる（result === undefined）（実際に書き込みが発生するタイミングでプロンプトが出るはず）
    set(atomMode, mode);
  },
);

//|
//| このフォルダ外からアクセスするもの
//|

const atomReadOnly = atom(
  (get) => get(atomMode) === "read",
  async (_, set, readOnly: boolean) =>
    set(atomSetModeWithPermission, readOnly ? "read" : "readwrite"),
);

const atomReset = atom(null, (_, set) => {
  set(atomFolder, undefined);
  set(atomMode, undefined);
});

export const model起動直後 = {
  /** `atomMode` を boolean で表したもの */
  atomReadOnly,

  /** 選択されているルートフォルダ */
  useFolder: () => useAtomValue(atomFolder),

  /** ルートフォルダの選択を取り消す */
  useReset: () => useSetAtom(atomReset),
};
