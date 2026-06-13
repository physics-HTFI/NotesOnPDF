import { modelUI } from "@/models/modelUI/modelUI";
import { useAtom, useAtomValue } from "jotai";
import { modelフォルダ } from "../../modelフォルダ";
import { jsonUtils } from "./jsonUtils";
import { getFileFromPath } from "./getFileFromPath";
import { consoleDev } from "../consoleDebug";

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
  const folder = useAtomValue(modelフォルダ.folder.atom);
  const setAlert = modelUI.alert.useSet();

  return async <T,>(path: string, alert: boolean) => {
    const file = await getFileFromPath(path, folder, false);
    const value = await jsonUtils.read<T>(file);
    consoleDev(`read JSON: ${path}`);
    if (alert && !value) {
      setAlert("error", `読み込みに失敗しました："${path}"`);
    }
    return value;
  };
}

function useSaveJson() {
  const folder = useAtomValue(modelフォルダ.folder.atom);
  const setAlert = modelUI.alert.useSet();
  const [readOnly, setReadOnly] = useAtom(modelフォルダ.readOnly.atom);

  return async (object: unknown, path: string) => {
    if (readOnly || !folder || !object) return;
    const file = await getFileFromPath(path, folder, true);
    const ok = await jsonUtils.write(object, file);
    consoleDev(`write JSON: ${path}`);
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
