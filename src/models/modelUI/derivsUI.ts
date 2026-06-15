import { atom } from "jotai";
import { atomsUI } from "./atomsUI";
import { atomsファイル } from "../modelファイル/atomsファイル";

export const derivsUI = {
  clearAlert: atom(null, (_, set) => set(atomsUI.alert, undefined)),
  close_pdfSelector: atom(null, (get, set) => {
    if (get(atomsファイル.pdf.info).status !== "loaded") return;
    set(atomsUI.openDrawer_pdfSelector, false);
  }),
  open_pdfSelector: atom(null, (_, set) => {
    set(atomsUI.openDrawer_pdfSelector, true);
  }),
};
