import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { modelUi } from "@/components/global/modelUi";
import type Coverages from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";
import type { PdfInfo } from "@/types/PdfInfo";
import { createOrGetPdfNotes, FORMAT_VERSION } from "@/types/PdfNotes";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useContext } from "react";
import { modelフォルダ } from "../state起動直後/modelフォルダ";
import { getFileTree } from "./utils/getFileTree/getFileTree";
import { useGetCoverages } from "./utils/useGetCoverages.ts/useGetCoverages";
import { mapUseOnChangeWatchPdfPath } from "./Watch/WatchPdfPath/mapUseOnChangeWatchPdfInfo";
import { mapUseOnChangeWatchFolder } from "../state起動直後/WatchFolder/mapUseOnChangeWatchFolder";
import { PATH_COVERAGES } from "@/types/CONSTANTS";
import type PdfNotes from "@/types/PdfNotes";
import { modelPDF閲覧 } from "../statePDF閲覧/modelPDF閲覧";
import { parsePath } from "../statePDF閲覧/utils/parsePath";

const atomFileTree = atom<FileTree>();
const atomCoverages = atom<Coverages>();
const atomPath = atom<string>();
const atomInfo = atom<PdfInfo>();

//|
//| 派生 atom
//|

const atomFileTreeValue = atom((get) => get(atomFileTree));
const atomCoveragesValue = atom((get) => get(atomCoverages));
const atomHandleValue = atom((get) => {
  const fileTree = get(atomFileTree);
  const path = get(atomPath);
  if (!fileTree || !path) return undefined;
  const item = findTreeItem(fileTree, path);
  if (!item || item.type !== "file") return undefined;
  return item.handle;
});

function useSetCoverages() {
  const setCoverages = useSetAtom(atomCoverages);
  const write = modelフォルダ.file.useSaveJson();

  return async (coverages?: Coverages) => {
    if (!coverages) return;
    setCoverages(coverages);
    await write(coverages, PATH_COVERAGES);
  };
}

//|
//| export
//|

export const modelPDFファイル = {
  fileTree: { atomValue: atomFileTreeValue },
  coverages: { atom: atomCoveragesValue, useSet: useSetCoverages },

  path: {
    atom: atomPath,
  },

  handle: {
    atomValue: atomHandleValue,
  },

  info: {
    atom: atomInfo,
  },
};

//|
//| Watch
//|

const modelName = "modelPDFファイル";

// path 変更時の処理
mapUseOnChangeWatchPdfPath.set(modelName, () => {
  const setWaiting = useSetAtom(modelUi.waiting.atom);
  const setInfo = useSetAtom(modelPDFファイル.info.atom);
  const read = modelフォルダ.file.useReadJson();
  const setPdfNotes = useSetAtom(modelPDF閲覧.pdfNotes.atom);

  const {
    setId,
    updaters: { assignPdfNotes },
  } = useContext(PdfNotesContext);

  return async (path) => {
    document.title = "NotesOnPDF";
    if (!path) {
      setInfo(undefined);
      return;
    }
    setWaiting(true);
    setInfo({ path });

    assignPdfNotes(undefined);
    const jsonPath = parsePath(path);
    if (jsonPath) {
      const pdfNotes = await read<PdfNotes>(jsonPath.jsonPath, false);
      setPdfNotes(pdfNotes);
      if (pdfNotes && pdfNotes.version !== FORMAT_VERSION) {
        // TODO マイグレーション
        console.log("バージョンが異なります");
      }
      assignPdfNotes(createOrGetPdfNotes(jsonPath));
      setId(path);
      document.title = jsonPath.name;
    } else {
      setWaiting(false);
    }
  };
});

// folder 変更時の処理
mapUseOnChangeWatchFolder.set(modelName, () => {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const setFileTree = useSetAtom(atomFileTree);
  const getCoverages = useGetCoverages();
  const setCoverages = useSetAtom(atomCoverages);

  return async () => {
    // fileTree の更新
    const fileTree = await getFileTree(folder);
    setFileTree(fileTree);

    // coverages の更新
    const coverages = await getCoverages(fileTree);
    setCoverages(coverages);
  };
  // fileTree は folder から一意的に決まるので、派生 atom にしてもよい。
  // ただ、coverages の初期値の計算に必要になるので、ここで合わせて設定するようにしている。
});
