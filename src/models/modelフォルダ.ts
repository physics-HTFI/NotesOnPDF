import { atom } from "jotai";
import { useJson } from "./utils/useJson/useJson";

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

const atomReadOnly = atom(
  (get) => get(atomMode) === "read",
  async (_, set, readOnly: boolean) =>
    set(atomSetPermission, readOnly ? "read" : "readwrite"),
);

const atomReset = atom(null, (_, set) => {
  set(atomFolder, undefined);
  set(atomMode, undefined);
});

const atom選択完了Value = atom((get) => !!get(atomFolder) && !!get(atomMode));

//|
//| export
//|

export const modelフォルダ = {
  /** ルートフォルダの選択・取得 */
  folder: {
    atom: atomFolder,

    /** ルートフォルダにパーミッションを設定する（選択されていれば） */
    atomSetPermission,

    /** ルートフォルダとパーミッションが設定されていれば `true` */
    atom選択完了Value,

    /** ルートフォルダの選択を取り消す */
    atomReset,
  },

  /** ファイルの書き込みを許すかどうかのフラグ */
  readOnly: {
    atom: atomReadOnly,
  },

  json: {
    useRead: useJson.useRead,
    useSave: useJson.useSave,
  },
};
