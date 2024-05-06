import IModel from "@/models/IModel";
import Model from "@/models/Model";
import ModelMock from "@/models/Model.Mock";
import { createContext } from "react";

/**
 * `IModel`を取得するためのコンテクスト。
 * 初期値として既に適切なモデルを設定しているので`ModelContext.Provider`は不要。
 */
export const ModelContext = createContext<{ model: IModel }>({
  model:
    import.meta.env.VITE_IS_MOCK === "true" ? new ModelMock() : new Model(),
});
