import { modelGlobal } from "@/global/modelGlobal";
import { modelフォルダ } from "../modelフォルダ";
import { jsonUtils } from "./jsonUtils";
import { useAtom, useAtomValue } from "jotai";

export const useJson = {
  /** パスからファイルハンドルを取得する */
  useGetFileHandle,

  /** 失敗時は undefined が返る */
  useRead: useReadJson,

  /** 失敗時は false が返る */
  useSave: useSaveJson,
};

//|
//| private
//|

function useGetFileHandle() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  return (path: string, create: boolean) =>
    getFileHandleFromPath(path, folder, create);
}

function useReadJson() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const setAlert = modelGlobal.alert.useSet();

  return async <T,>(path: string, alert: boolean) => {
    const file = await getFileHandleFromPath(path, folder, false);
    const value = await jsonUtils.read<T>(file);
    if (alert && !value) {
      setAlert("error", `読み込みに失敗しました："${path}"`);
    }
    return value;
  };
}

function useSaveJson() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const setAlert = modelGlobal.alert.useSet();
  const [readOnly, setReadOnly] = useAtom(modelフォルダ.readOnly.atom);

  return async (object: unknown, path: string) => {
    if (readOnly || !folder || !object) return;
    const file = await getFileHandleFromPath(path, folder, true);
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

/**
 * `dirHandle` からの相対パス `path` を用いてファイルハンドルを取得する。
 * 例：`path = "path/to/file.txt"`。
 * 失敗時は `undefined` が返る。
 */
async function getFileHandleFromPath(
  path: string | undefined,
  dirHandle: FileSystemDirectoryHandle | undefined,
  create: boolean,
): Promise<FileSystemFileHandle | undefined> {
  try {
    if (!path || !dirHandle) return undefined;
    const dirs = path.split(/[/\\]/);
    const file = dirs.pop();
    if (!file) return undefined;
    let handle = dirHandle;
    for (const dir of dirs) {
      handle = await handle.getDirectoryHandle(dir, { create });
    }
    return await handle.getFileHandle(file, { create });
  } catch (_) {
    return undefined;
  }
}
