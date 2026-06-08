import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { modelUI } from "@/models/modelUI";
import type Coverages from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";
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
import { usePdf } from "./utils/usePdf/PdfJs.store";
import { modelPDF履歴 } from "./modelPDF履歴";

const atomFileTree = atom<FileTree>();
const atomCoverages = atom<Coverages>();
const atomPath = atom<string>();
const atomAppSettings = atom<AppSettings>();
const atomPdfNotes = atom<PdfNotes>();
const atomPdfLoaded = atom(false);

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
  },
};

//|
//| watch
//|

const id = "modelPDFファイル";

// pdfPath 変更時の処理
watchMaps.pdfPath.set(id, () => {
  const setWaiting = useSetAtom(modelUI.waiting.atom);
  const read = modelフォルダ.json.useRead();
  const setPdfNotes = useSetAtom(modelファイル.pdfNotes.atom);
  const setAlert = modelUI.alert.useSet();
  const setReadOnly = useSetAtom(modelフォルダ.readOnly.atom);
  const { setPdfHandle } = usePdf();
  const handle = useAtomValue(atomHandleValue);
  const setOpenDrawer = useSetAtom(modelUI.openDrawer.pdfFileTree.atom);
  const setPdfLoaded = useSetAtom(atomPdfLoaded);
  const addPathToPdfHistory = modelPDF履歴.update.useAdd();

  const {
    updaters: { assignPdfNotes },
  } = useContext(PdfNotesContext);

  return async (path) => {
    document.title = "NotesOnPDF";

    // PDF ファイル読み込み／アンロード
    setWaiting(true);
    setPdfLoaded(false);
    setPdfHandle(handle, (totalPages) => {
      setOpenDrawer(false);
      if (path && totalPages) void addPathToPdfHistory(path, totalPages);
      setWaiting(false);
      setPdfLoaded(true);
    });

    if (!path) return;

    assignPdfNotes(undefined);
    const jsonPath = parsePath(path);
    if (!jsonPath) return;
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
    document.title = jsonPath.name;
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
