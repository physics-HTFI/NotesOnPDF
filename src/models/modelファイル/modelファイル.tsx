import { useAtomValue, useSetAtom } from "jotai";
import { atomsファイル } from "./atomsファイル";
import { derivsファイル } from "./derivsファイル";

//|
//| export
//|

export const modelファイル = {
  fileTree: {
    useValue: () => useAtomValue(derivsファイル.fileTreeValue),
  },

  coverages: {
    useValue: () => useAtomValue(atomsファイル.coverages),
  },

  appSettings: {
    useValue: () => useAtomValue(atomsファイル.appSettings),
    useSet: () => useSetAtom(atomsファイル.appSettings),
  },

  pdf: {
    path: {
      useValue: () => useAtomValue(atomsファイル.pdf.path),
      useSet: () => useSetAtom(atomsファイル.pdf.path),
    },
    useTitleValue: () => useAtomValue(derivsファイル.titleValue),
    useJsonPathValue: () => useAtomValue(derivsファイル.jsonPathValue),
    usePageRectValue: () => useAtomValue(atomsファイル.pdf.pageRect),
  },
};
