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
  const { readOnly, serverFailed, setErrorMessage } =
    useContext(UiStateContext);
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
        setErrorMessage(model.getMessage("設定ファイルの取得"));
      });
  }, [model, serverFailed, initialized, setErrorMessage]);

  useEffect(() => {
    if (!appSettings || readOnly) return;
    model.putAppSettings(appSettings).catch(() => {
      setErrorMessage(model.getMessage("設定ファイルの保存"));
    });
  }, [appSettings, model, readOnly, setErrorMessage]);

  return (
    <AppSettingsContext.Provider value={{ appSettings, setAppSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}
