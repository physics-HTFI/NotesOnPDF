import type IModel from "@/models/IModel";
import ModelNull from "@/models/Model.Null";
import type AppSettings from "@/types/AppSettings";
import { createContext } from "react";
import type Coverages from "@/types/Coverages";
import type { FileTree } from "@/types/FileTree";

/**
 * `IModel`および初期化に必要なデータ（`appSettings`, `fileTree`, `coverages`）の取得・設定
 */
const ModelContext = createContext<{
  model: IModel;
  appSettings?: AppSettings;
  fileTree?: FileTree;
  coverages?: Coverages;
  /** `appSettings`, `fileTree`, `coverages`の読み込みが終わったら`true` */
  initialized: boolean;
  /** `true`の時は、注釈などの変更ができてはならない */
  inert: boolean;
  setModel: (model: IModel) => void;
  setAppSettings: (appSettings: AppSettings) => void;
  setCoverages: (coverages: Coverages) => void;
}>({
  model: new ModelNull(),
  initialized: false,
  inert: false,
  setModel: () => undefined,
  setAppSettings: () => undefined,
  setCoverages: () => undefined,
});

export default ModelContext;
