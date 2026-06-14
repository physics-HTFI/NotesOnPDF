import { useAtom } from "jotai";
import { Watch } from "../Watch/Watch";
import { GetAppSettings_default } from "@/types/AppSettings";
import type AppSettings from "@/types/AppSettings";
import { PATH_SETTINGS } from "@/types/CONSTANTS";
import { modelフォルダ } from "../modelフォルダ/modelフォルダ";
import { atomsファイル } from "./atomsファイル";

/**
 * 設定ファイルの入出力を行う
 */
export function Watch_設定入出力() {
  const folder = modelフォルダ.folder.useValue();
  const [settings, setSettings] = useAtom(atomsファイル.appSettings);
  const read = modelフォルダ.json.useRead();
  const save = modelフォルダ.json.useSave();

  return (
    <>
      {/* folder が変化したら appSettings を読み込む */}
      <Watch
        target={folder}
        onChange={async () => {
          const settings = {
            ...GetAppSettings_default(),
            ...((await read<AppSettings>(PATH_SETTINGS, false)) ?? {}),
          };
          setSettings(settings);
        }}
      />

      {/* settings が変化したら保存する */}
      <Watch
        target={settings}
        onChange={() => {
          void save(settings, PATH_SETTINGS);
        }}
      />
    </>
  );
}
