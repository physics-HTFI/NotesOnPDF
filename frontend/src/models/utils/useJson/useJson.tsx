import { modelUi } from "@/components/global/modelUi";
import { useAtom, useAtomValue } from "jotai";
import { modelフォルダ } from "../../modelフォルダ";
import { jsonUtils } from "./jsonUtils";
import { useGetFileFromPath } from "../useGetFileFromPath/useGetFileFromPath";

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
  const getFileFromPath = useGetFileFromPath();
  const setAlert = modelUi.alert.useSet();

  return async <T,>(path: string, alert: boolean) => {
    const file = await getFileFromPath(path, false);
    const value = await jsonUtils.read<T>(file);
    if (alert && !value) {
      setAlert("error", `読み込みに失敗しました："${path}"`);
    }
    return value;
  };
}

function useSaveJson() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const setAlert = modelUi.alert.useSet();
  const [readOnly, setReadOnly] = useAtom(modelフォルダ.readOnly.atom);
  const getFileFromPath = useGetFileFromPath();

  return async (object: unknown, path: string) => {
    if (readOnly || !folder || !object) return;
    const file = await getFileFromPath(path, true);
    const ok = await jsonUtils.write(object, file);
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
