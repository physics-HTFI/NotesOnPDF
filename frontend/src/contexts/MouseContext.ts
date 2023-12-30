import { createContext } from "react";

interface MouseContextType {
  mouse?: { pageX: number; pageY: number };
  pageRect?: DOMRect;
}

export const MouseContext = createContext<MouseContextType>({});
