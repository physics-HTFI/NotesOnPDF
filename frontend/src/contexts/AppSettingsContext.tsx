import AppSettings from "@/types/AppSettings";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import ModelContext from "./ModelContext";
import UiStateContext from "./UiStateContext";

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
  const { model } = useContext(ModelContext);
  const { readOnly, setAccessFailedReason } = useContext(UiStateContext);
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
