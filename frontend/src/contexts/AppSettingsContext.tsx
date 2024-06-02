import AppSettings from "@/types/AppSettings";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import ModelContext from "./ModelContext";
import UiContext from "./UiContext";

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
  const { readOnly, serverFailed, setAlert } = useContext(UiContext);
  const [appSettings, setAppSettings] = useState<AppSettings>();
  const initialized = !!appSettings;

  useEffect(() => {
    if (serverFailed || initialized) return;
    model
      .getAppSettings()
      .then((settings) => {
        setAppSettings(settings);
      })
      .catch(() => {
        setAlert("error", "設定ファイルの取得に失敗しました");
      });
  }, [model, serverFailed, initialized, setAlert]);

  useEffect(() => {
    if (!appSettings || readOnly) return;
    model.putAppSettings(appSettings).catch(() => {
      setAlert("error", "設定ファイルの保存に失敗しました");
    });
  }, [appSettings, model, readOnly, setAlert]);

  return (
    <AppSettingsContext.Provider value={{ appSettings, setAppSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}
