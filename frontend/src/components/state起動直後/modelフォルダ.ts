import { atom, useSetAtom } from "jotai";
import { useJson } from "./useJson/useJson";
import { useGetFileFromPath } from "./useGetFileFromPath/useGetFileFromPath";

//|
//| atom
//|

/** 選択されているルートフォルダ */
const atomFolder = atom<FileSystemDirectoryHandle>();

/** ルートフォルダに与えられているパーミッション */
const atomMode = atom<"read" | "readwrite">();

//|
//| 派生 atom
//|

const atom設定完了value = atom((get) => !!get(atomFolder) && !!get(atomMode));

/** ルートフォルダにパーミッションを設定する */
const atomSetPermission = atom(
  null,
  async (get, set, mode: "read" | "readwrite") => {
    const folder = get(atomFolder);
    if (!folder) return;
    const result = await folder.requestPermission?.({ mode });
    if (result && result !== "granted") return; // requestPermission がないブラウザは通過させる（result === undefined）（実際に書き込みが発生するタイミングでプロンプトが出るはず）
    set(atomMode, mode);
  },
);

const atomFolderValue = atom((get) => get(atomFolder));

const atomReadOnly = atom(
  (get) => get(atomMode) === "read",
  async (_, set, readOnly: boolean) =>
    set(atomSetPermission, readOnly ? "read" : "readwrite"),
);

const atomReset = atom(null, (_, set) => {
  set(atomFolder, undefined);
  set(atomMode, undefined);
});

//|
//| export
//|

export const modelフォルダ = {
  /** ファイルの書き込みを許すかどうかのフラグ */
  readOnly: {
    atom: atomReadOnly,
  },

  /** 選択されているルートフォルダ */
  folder: {
    atomValue: atomFolderValue,
    useSet: () => useSetAtom(atomFolder),

    /** ルートフォルダの選択を取り消す */
    useReset: () => useSetAtom(atomReset),

    /** ルートフォルダにパーミッションを設定する */
    useSetPermission: () => useSetAtom(atomSetPermission),
  },

  準備完了: {
    atomValue: atom設定完了value,
  },

  file: {
    useReadJson: useJson.useRead,
    useSaveJson: useJson.useSave,
    useGetFileFromPath: useGetFileFromPath,
  },
};
