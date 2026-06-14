import { modelUI } from "@/models/modelUI/modelUI";
import { useAtom } from "jotai";
import { modelフォルダ } from "../../modelフォルダ/modelフォルダ";
import { jsonUtils } from "./jsonUtils";
import { getFileFromPath } from "./getFileFromPath";
import { derivsフォルダ } from "../derivsフォルダ";
import { consoleDev } from "@/utils/consoleDebug";

/**
 * 選択フォルダにおけるファイルの入出力を行う
 */
export const useJson = {
  /** 失敗時は undefined が返る */
  useRead: useReadJson,

  /** 失敗時は false が返る */
  useSave: useSaveJson,
};

//|
//| private
//|

function useReadJson() {
  const folder = modelフォルダ.folder.useValue();
  const setAlert = modelUI.alert.useSet();

  return async <T,>(path: string, alert: boolean) => {
    const file = await getFileFromPath(path, folder, false);
    const value = await jsonUtils.read<T>(file);
    consoleDev(`useReadJson: ${path}`);
    if (alert && !value) {
      setAlert("error", `読み込みに失敗しました："${path}"`);
    }
    return value;
  };
}

function useSaveJson() {
  const folder = modelフォルダ.folder.useValue();
  const setAlert = modelUI.alert.useSet();
  const [readOnly, setReadOnly] = useAtom(derivsフォルダ.readOnly);

  return async <T,>(object: T, path: string) => {
    if (readOnly || !folder || !object) return;
    const file = await getFileFromPath(path, folder, true);
    const ok = await jsonUtils.write(object, file);
    consoleDev(`useSaveJson: ${path}`);
    if (!ok) {
      await setReadOnly(true);
      setAlert(
        "error",
        <>
          保存に失敗しました：{path}。
          <br />
          読み取り専用モードに切り替えました。
        </>,
      );
    }
  };
}
