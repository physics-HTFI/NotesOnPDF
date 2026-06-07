import type IModel from "@/models/IModel";
import ModelNull from "@/models/Model.Null";
import type AppSettings from "@/types/AppSettings";
import { createContext } from "react";

/**
 * `IModel`および初期化に必要なデータ（`appSettings`, `fileTree`, `coverages`）の取得・設定
 */
const ModelContext = createContext<{
  model: IModel;
  appSettings?: AppSettings;
  setModel: (model: IModel) => void;
  setAppSettings: (appSettings: AppSettings) => void;
}>({
  model: new ModelNull(),
  setModel: () => undefined,
  setAppSettings: () => undefined,
});

export default ModelContext;
