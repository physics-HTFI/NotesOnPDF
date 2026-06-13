import { atom } from "jotai";
import { atomsUI } from "./atomsUI";

export const derivsUI = {
  clearAlert: atom(null, (_, set) => set(atomsUI.alert, undefined)),
};
