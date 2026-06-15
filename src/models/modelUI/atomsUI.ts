import type { MousePosition } from "@/types/MousePosition";
import { atom } from "jotai";
import type { ReactNode } from "react";

export const atomsUI = {
  alert: atom<{ severity: "error" | "info"; message: ReactNode }>(),
  waiting: atom<boolean>(false),
  mouse: atom<MousePosition>(),
  openDrawer_pdfSelector: atom<boolean>(true),
  openDrawer_settings: atom<boolean>(false),
};
