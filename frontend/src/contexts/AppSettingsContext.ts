import { AppSettings } from "@/types/AppSettings";
import { createContext } from "react";

interface AppSettingsContextType {
  appSettings?: AppSettings;
  setAppSettings?: (appSettings: AppSettings) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextType>({});
