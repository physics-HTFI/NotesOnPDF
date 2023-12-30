import { createContext } from "react";

interface Mouse {
  pageX: number;
  pageY: number;
}

interface MouseContextType {
  mouse?: Mouse;
  setMouse?: (m: Mouse) => void;
  pageRect?: DOMRect;
}

export const MouseContext = createContext<MouseContextType>({});
