import { modelGlobal } from "@/global/modelGlobal";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

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

export const atomFolderValue = atom((get) => get(atomFolder));

const atomReadOnly = atom(
  (get) => get(atomMode) === "read",
  async (_, set, readOnly: boolean) =>
    set(atomSetModeWithPermission, readOnly ? "read" : "readwrite"),
);

const atomReset = atom(null, (_, set) => {
  set(atomFolder, undefined);
  set(atomMode, undefined);
});

const atomSetReadonlyWithMessage = atom(
  null,
  async (_, set, reason: string) => {
    void set(atomReadOnly, true);
    set(modelGlobal.alert.atom, {
      type: "error",
      message: (
        <>
          {reason}に失敗しました。
          <br />
          読み取り専用モードに切り替えました。
        </>
      ),
    });
  },
);

export const model起動直後 = {
  /** ファイルの書き込みを許すかどうかのフラグ */
  readOnly: {
    atom: atomReadOnly,
    use: () => useAtom(atomReadOnly),
    useValue: () => useAtomValue(atomReadOnly),

    /** 例：`set(atom, "ファイルの出力")` */
    atomSetWithMessage: atomSetReadonlyWithMessage,

    /** 例：`set("ファイルの出力")` */
    useSetWithMessage: () => useSetAtom(atomSetReadonlyWithMessage),
  },

  /** 選択されているルートフォルダ */
  folder: {
    atomValue: atomFolderValue,
    useValue: () => useAtomValue(atomFolder),
  },

  /** ルートフォルダの選択を取り消す */
  useReset: () => useSetAtom(atomReset),
};
