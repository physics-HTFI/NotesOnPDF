import { modelGlobal } from "@/global/modelGlobal";
import { modelフォルダ } from "../modelフォルダ";
import { fileUtils } from "./fileUtils";

export const useJson = {
  /** 失敗時は undefined が返る */
  useRead,
  /** 失敗時は false が返る */
  useSave,
};

//|
//| private
//|

function useRead() {
  const folder = modelフォルダ.folder.useValue();
  const setAlert = modelGlobal.alert.useSet();

  return {
    readAsync: async <T,>(path: string, alert: boolean) => {
      const value = await fileUtils.readJsonFromPathAsync<T>(path, folder);
      if (alert && !value) {
        setAlert("error", `"${path}" の読み込みに失敗しました。`);
      }
      return value;
    },
  };
}

function useSave() {
  const folder = modelフォルダ.folder.useValue();
  const setAlert = modelGlobal.alert.useSet();
  const setReadOnly = modelフォルダ.readOnly.useSet();

  return {
    saveAsync: async (object: unknown, path: string) => {
      if (!object) return;
      const ok = await fileUtils.writeJsonToPathAsync(object, path, folder);
      if (!ok) {
        setReadOnly(true);
        setAlert(
          "error",
          <>
            {path}の保存に失敗しました。
            <br />
            読み取り専用モードに切り替えました。
          </>,
        );
      }
    },
  };
}
