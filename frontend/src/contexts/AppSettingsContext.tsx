import { AppSettings } from "@/types/AppSettings";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModelContext } from "./ModelContext";

interface AppSettingsContextType {
  appSettings?: AppSettings;
  setAppSettings?: (appSettings: AppSettings) => void;
}

/**
 * アプリ設定のコンテクスト
 */
export const AppSettingsContext = createContext<AppSettingsContextType>({});

/**
 * `AppSettingsContextProvider`の引数
 */
interface Props {
  children: ReactNode;
}

/**
 * `AppSettingsContext`のプロバイダー
 */
export const AppSettingsContextProvider: FC<Props> = ({ children }) => {
  const model = useContext(ModelContext);
  const [appSettings, setAppSettings] = useState<AppSettings>();

  useEffect(() => {
    model
      .getAppSettings()
      .then((settings) => {
        setAppSettings(settings);
      })
      .catch(() => undefined);
  }, [model]);

  useEffect(() => {
    if (!appSettings) return;
    model.putAppSettings(appSettings).catch(() => undefined);
  }, [appSettings, model]);

  return (
    <AppSettingsContext.Provider value={{ appSettings, setAppSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
