import { atom, useSetAtom } from "jotai";
import { mapUseOnChangeWatchFolder } from "../state起動直後/WatchFolder/mapUseOnChangeWatchFolder";
import { modelフォルダ } from "../state起動直後/modelフォルダ";
import { PATH_SETTINGS } from "@/types/CONSTANTS";
import { GetAppSettings_default } from "@/types/AppSettings";
import type AppSettings from "@/types/AppSettings";

const atomAppSettings = atom<AppSettings>();

//|
//| 派生 atom
//|

const atomAppSettingsValue = atom((get) => get(atomAppSettings));

function useSetAppSettings() {
  const setAppSettings = useSetAtom(atomAppSettings);
  const write = modelフォルダ.file.useSaveJson();

  return async (appSettings?: AppSettings) => {
    if (!appSettings) return;
    setAppSettings(appSettings);
    await write(appSettings, PATH_SETTINGS);
  };
}

//|
//| export
//|

export const modelPDF閲覧 = {
  appSettings: { atom: atomAppSettingsValue, useSet: useSetAppSettings },
};

//|
//| Watch
//|

const modelName = "modelPDF閲覧";

// folder 変更時の処理
mapUseOnChangeWatchFolder.set(modelName, () => {
  const setSettings = useSetAtom(atomAppSettings);
  const read = modelフォルダ.file.useReadJson();

  return async () => {
    // settings の取得
    const settings = {
      ...GetAppSettings_default(),
      ...((await read<AppSettings>(PATH_SETTINGS, false)) ?? {}),
    };
    setSettings(settings);
  };
});
