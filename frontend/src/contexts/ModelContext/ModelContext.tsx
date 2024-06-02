import IModel, { ModelFlags } from "@/models/IModel";
import ModelNull from "@/models/Model.Null";
import AppSettings from "@/types/AppSettings";
import { createContext } from "react";
import Coverages from "@/types/Coverages";
import FileTree from "@/types/FileTree";

/**
 * `IModel`および初期化に必要なデータ（`appSettings`, `fileTree`, `coverages`）の取得・設定
 */
const ModelContext = createContext<{
  model: IModel;
  modelFlags: ModelFlags;
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
  modelFlags: new ModelNull().getFlags(),
  initialized: false,
  inert: false,
  setModel: () => undefined,
  setAppSettings: () => undefined,
  setCoverages: () => undefined,
});

export default ModelContext;
