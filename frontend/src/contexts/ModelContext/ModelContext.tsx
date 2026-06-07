import type IModel from "@/models/IModel";
import ModelNull from "@/models/Model.Null";
import { createContext } from "react";

/**
 * `IModel`および初期化に必要なデータ（`appSettings`, `fileTree`, `coverages`）の取得・設定
 */
const ModelContext = createContext<{
  model: IModel;
  setModel: (model: IModel) => void;
}>({
  model: new ModelNull(),
  setModel: () => undefined,
});

export default ModelContext;
