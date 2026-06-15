import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomsフォルダ } from "./atomsフォルダ";
import { derivsフォルダ } from "./derivsフォルダ";
import { useJson } from "./useJson/useJson";

export const modelフォルダ = {
  /** ルートフォルダの選択・取得 */
  folder: {
    use: () => useAtom(atomsフォルダ.folder),
    useValue: () => useAtomValue(atomsフォルダ.folder),

    /** フォルダにパーミッションを与える（必要に応じて確認ダイアログが出る） */
    useSetPermission: () => useSetAtom(derivsフォルダ.setPermission),

    /** フォルダの選択を取り消す */
    useReset: () => useSetAtom(derivsフォルダ.reset),

    /** フォルダとパーミッションが設定されていれば `true` */
    useIs選択完了Value: () => useAtomValue(derivsフォルダ.is選択完了Value),
  },

  /** ファイルの書き込みを許すかどうかの切り替え */
  readOnly: {
    use: () => useAtom(derivsフォルダ.readOnly),
    useValue: () => useAtomValue(derivsフォルダ.readOnly),
    useSet: () => useSetAtom(derivsフォルダ.readOnly),
  },

  json: {
    useRead: useJson.useRead,

    /** readOnly の場合、または引数が `undefined` の場合は何もしない。 */
    useSave: useJson.useSave,
  },
};
