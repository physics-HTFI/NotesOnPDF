import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { modelUI } from "@/models/modelUI";
import type Coverages from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";
import type { PdfInfo } from "@/types/PdfInfo";
import { createOrGetPdfNotes, FORMAT_VERSION } from "@/types/PdfNotes";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useContext } from "react";
import { modelフォルダ } from "./modelフォルダ";
import { useGetCoverages } from "./utils/useGetCoverages";
import { PATH_COVERAGES, PATH_SETTINGS } from "@/types/CONSTANTS";
import type PdfNotes from "@/types/PdfNotes";
import { parsePath } from "./utils/parsePath";
import { getFileTree } from "./utils/getFileTree/getFileTree";
import { watchMaps } from "./Watch/watchMaps";
import type AppSettings from "@/types/AppSettings";
import { GetAppSettings_default } from "@/types/AppSettings";

const atomFileTree = atom<FileTree>();
const atomCoverages = atom<Coverages>();
const atomPath = atom<string>();
const atomInfo = atom<PdfInfo>();
const atomAppSettings = atom<AppSettings>();
const atomPdfNotes = atom<PdfNotes>();

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

const atomAppSettingsValue = atom((get) => get(atomAppSettings));

function useSetAppSettings() {
  const setAppSettings = useSetAtom(atomAppSettings);
  const write = modelフォルダ.json.useSave();

  return async (appSettings?: AppSettings) => {
    if (!appSettings) return;
    setAppSettings(appSettings);
    await write(appSettings, PATH_SETTINGS);
  };
}

function useSetCoverages() {
  const setCoverages = useSetAtom(atomCoverages);
  const write = modelフォルダ.json.useSave();

  return async (coverages?: Coverages) => {
    if (!coverages) return;
    setCoverages(coverages);
    await write(coverages, PATH_COVERAGES);
  };
}

//|
//| export
//|

export const modelファイル = {
  fileTree: { atomValue: atomFileTreeValue },

  coverages: { atom: atomCoveragesValue, useSet: useSetCoverages },
  appSettings: { atom: atomAppSettingsValue, useSet: useSetAppSettings },
  pdfNotes: { atom: atomPdfNotes },

  pdf: {
    atomPath: atomPath,
    atomInfo: atomInfo,
    atomHandleValue: atomHandleValue,
  },
};

//|
//| watch
//|

const id = "modelPDFファイル";

// path 変更時の処理
watchMaps.pdfPath.set(id, () => {
  const setWaiting = useSetAtom(modelUI.waiting.atom);
  const setInfo = useSetAtom(modelファイル.pdf.atomInfo);
  const read = modelフォルダ.json.useRead();
  const setPdfNotes = useSetAtom(modelファイル.pdfNotes.atom);
  const setAlert = modelUI.alert.useSet();
  const setReadOnly = useSetAtom(modelフォルダ.readOnly.atom);

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
        setAlert(
          "error",
          <>
            注釈ファイルのバージョンが異なります。 <br />
            編集するとファイルの内容が失われる可能性があります。 <br />
            読み取り専用モードに切り替えました。 <br />
          </>,
        );
        await setReadOnly(true);
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
watchMaps.folder.set(id, () => {
  const folder = useAtomValue(modelフォルダ.folder.atom);
  const setFileTree = useSetAtom(atomFileTree);
  const getCoverages = useGetCoverages();
  const setCoverages = useSetAtom(atomCoverages);
  const setSettings = useSetAtom(atomAppSettings);
  const setPath = useSetAtom(atomPath);
  const read = modelフォルダ.json.useRead();

  return async () => {
    setPath(undefined);

    // fileTree の更新
    const fileTree = await getFileTree(folder);
    setFileTree(fileTree);

    // coverages の更新
    const coverages = await getCoverages(fileTree);
    setCoverages(coverages);

    // settings の取得
    const settings = {
      ...GetAppSettings_default(),
      ...((await read<AppSettings>(PATH_SETTINGS, false)) ?? {}),
    };
    setSettings(settings);
  };
  // fileTree は folder から一意的に決まるので、派生 atom にしてもよい。
  // ただ、coverages の初期値の計算に必要になるので、ここで合わせて設定するようにしている。
});
