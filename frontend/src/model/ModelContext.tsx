import { createContext } from "react";
import IModel from "./IModel";

const ModelContext = createContext<IModel | null>(null);
export default ModelContext;
