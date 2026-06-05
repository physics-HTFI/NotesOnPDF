import type { PdfInfo } from "@/types/PdfInfo";
import { atom, useSetAtom } from "jotai";

const atomFile = atom<FileSystemFileHandle>();
const atomInfo = atom<PdfInfo>();

//|
//| 派生 atom
//|

const atomFileValue = atom((get) => get(atomFile));

const atomSelectPath = atom(null, (_, set, path: string | undefined) => {
  //    set(atomFile, file);
  set(atomInfo, path === undefined ? undefined : { path });
});

//|
//| export
//|

export const modelPDFファイル = {
  file: {
    atomValue: atomFileValue,
    useSelectPath: () => useSetAtom(atomSelectPath),
  },

  info: {
    atom: atomInfo,
  },
};
