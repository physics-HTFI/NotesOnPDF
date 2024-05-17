import IModel from "@/models/IModel";
import ModelDesktop from "@/models/Model.Desktop";
import ModelNull from "@/models/Model.Null";
import { ReactNode, createContext, useState } from "react";

const ModelContext = createContext<{
  model: IModel;
  setModel: (model: IModel) => void;
}>({
  model: new ModelNull(),
  setModel: () => undefined,
});

export default ModelContext;

/**
 * `ModelContext`のプロバイダー
 */
export function ModelContextProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<IModel>(
    import.meta.env.VITE_IS_WEB === "true"
      ? new ModelNull()
      : new ModelDesktop()
  );

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}
