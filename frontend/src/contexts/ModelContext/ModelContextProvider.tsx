import type IModel from "@/models/IModel";
import ModelNull from "@/models/Model.Null";
import type AppSettings from "@/types/AppSettings";
import { GetAppSettings_default } from "@/types/AppSettings";
import { type ReactNode, useEffect, useState } from "react";
import ModelContext from "./ModelContext";

/**
 * `ModelContext`のプロバイダー
 */
export function ModelContextProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<IModel>(() => new ModelNull());
  //const setAlert = modelUi.alert.useSet();
  const [appSettings, setAppSettings] = useState<AppSettings>();

  // `appSettings, FileTree, Coverages`を取得する
  useEffect(() => {
    loadAll(model)
      .then(({ appSettings }) => {
        setAppSettings(appSettings);
      })
      .catch((e?: Error) => {
        if (!e?.message) return;
        // setAlert("error", e.message);
      });
  }, [model]);

  return (
    <ModelContext.Provider
      value={{
        model,
        appSettings,
        setModel,
        setAppSettings,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

/**
 * `AppSettings, FileTree, Coverages`を取得する
 */
async function loadAll(model: IModel) {
  const appSettings: AppSettings = {
    ...GetAppSettings_default(),
    ...(await model.getAppSettings().catch(() => {
      throw new Error("設定ファイルの取得に失敗しました");
    })),
  };
  return { appSettings };
}
