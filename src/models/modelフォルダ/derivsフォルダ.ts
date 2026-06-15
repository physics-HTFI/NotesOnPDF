import { atom } from "jotai";
import { atomsフォルダ } from "./atomsフォルダ";

const atomSetPermission = atom(
  null,
  async (get, set, mode: "read" | "readwrite") => {
    const folder = get(atomsフォルダ.folder);
    if (!folder) return;
    const result = await folder.requestPermission?.({ mode });
    if (result && result !== "granted") return; // requestPermission がないブラウザは通過させる（result === undefined）（実際に書き込みが発生するタイミングでプロンプトが出るはず）
    set(atomsフォルダ.mode, mode);
  },
);

//|
//| export
//|

export const derivsフォルダ = {
  /** 選択フォルダにパーミッションを設定する */
  setPermission: atomSetPermission,

  readOnly: atom(
    (get) => get(atomsフォルダ.mode) === "read",
    async (_, set, readOnly: boolean) =>
      set(atomSetPermission, readOnly ? "read" : "readwrite"),
  ),

  reset: atom(null, (_, set) => {
    set(atomsフォルダ.folder, undefined);
    set(atomsフォルダ.mode, undefined);
  }),

  is選択完了Value: atom(
    (get) => !!get(atomsフォルダ.folder) && !!get(atomsフォルダ.mode),
  ),
};
