import type { PdfInfo } from "@/types/PdfInfo";
import { atom, useAtomValue } from "jotai";

const atomFile = atom<FileSystemFileHandle>();
const atomInfo = atom<PdfInfo>();

export const atomSelectPath = atom(null, (_, set, path: string | undefined) => {
  //    set(atomFile, file);
  set(atomInfo, path === undefined ? undefined : { path });
});

export const modelPDFファイル = {
  file: {
    useValue: () => useAtomValue(atomFile),
  },

  info: {
    atom: atomInfo,
    useValue: () => useAtomValue(atomInfo),
  },
};
