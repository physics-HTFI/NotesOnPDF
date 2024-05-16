import AppSettings from "@/types/AppSettings";
import { ReactNode, createContext, useEffect, useState } from "react";
import useModel from "@/hooks/useModel";

/**
 * アプリ設定のコンテクスト
 */
const AppSettingsContext = createContext<{
  appSettings?: AppSettings;
  setAppSettings?: (appSettings: AppSettings) => void;
}>({});

export default AppSettingsContext;

/**
 * `AppSettingsContext`のプロバイダー
 */
export function AppSettingsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { model, readOnly, setAccessFailedReason } = useModel();
  const [appSettings, setAppSettings] = useState<AppSettings>();

  useEffect(() => {
    model
      .getAppSettings()
      .then((settings) => {
        setAppSettings(settings);
      })
      .catch(() => {
        setAccessFailedReason("設定ファイルの取得");
      });
  }, [model, setAccessFailedReason]);

  useEffect(() => {
    if (!appSettings || readOnly) return;
    model.putAppSettings(appSettings).catch(() => {
      setAccessFailedReason("設定ファイルの保存");
    });
  }, [appSettings, model, readOnly, setAccessFailedReason]);

  return (
    <AppSettingsContext.Provider value={{ appSettings, setAppSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}
