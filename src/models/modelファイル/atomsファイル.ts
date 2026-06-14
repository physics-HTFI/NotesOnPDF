import type AppSettings from "@/types/AppSettings";
import type Coverages from "@/types/Coverages";
import { atom } from "jotai";

export const atomsファイル = {
  coverages: atom<Coverages>(),
  appSettings: atom<AppSettings>(),
  pdf: {
    path: atom<string>(),
    info: atom<PdfStatus>({ status: "not-loaded" }),
  },
};

type PdfStatus =
  | { status: "not-loaded" }
  | {
      status: "loaded";
      totalPages: number;
      path: string;
    };
