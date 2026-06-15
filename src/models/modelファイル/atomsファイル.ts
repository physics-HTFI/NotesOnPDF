import type AppSettings from "@/types/AppSettings";
import type Coverages from "@/types/Coverages";
import type { PageRect } from "@/types/PageRect";
import { atom } from "jotai";

export const atomsファイル = {
  coverages: atom<Coverages>(),
  appSettings: atom<AppSettings>(),
  pdf: {
    path: atom<string>(),
    info: atom<PdfStatus>({ status: "not-loaded" }),
    pageRect: atom<PageRect>(),
  },
};

type PdfStatus =
  | { status: "not-loaded" }
  | {
      status: "loaded";
      totalPages: number;
      path: string;
    };
