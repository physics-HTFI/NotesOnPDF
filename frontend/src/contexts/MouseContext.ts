import { createContext } from "react";

interface Mouse {
  pageX: number;
  pageY: number;
}

interface MouseContextType {
  mouse?: Mouse;
  setMouse?: (m: Mouse) => void;
  pageRect?: DOMRect;
  scale: number; // %単位
}

export const MouseContext = createContext<MouseContextType>({ scale: 100 });
