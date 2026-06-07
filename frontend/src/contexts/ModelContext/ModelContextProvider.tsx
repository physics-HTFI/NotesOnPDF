import type IModel from "@/models/IModel";
import ModelNull from "@/models/Model.Null";
import { type ReactNode, useState } from "react";
import ModelContext from "./ModelContext";

/**
 * `ModelContext`のプロバイダー
 */
export function ModelContextProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<IModel>(() => new ModelNull());

  return (
    <ModelContext.Provider
      value={{
        model,
        setModel,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}
