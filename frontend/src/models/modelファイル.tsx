import { modelUI } from "@/models/modelUI";
import type Coverages from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { modelフォルダ } from "./modelフォルダ";
import { useGetCoverages } from "./utils/useGetCoverages";
import { PATH_COVERAGES, PATH_SETTINGS } from "@/types/CONSTANTS";
import { getFileTree } from "./utils/getFileTree/getFileTree";
import { watchMaps } from "./Watch/watchMaps";
import type AppSettings from "@/types/AppSettings";
import { GetAppSettings_default } from "@/types/AppSettings";
import { usePdf } from "./utils/usePdf/usePdf";
import { modelPDF履歴 } from "./modelPDF履歴";
import { modelPdfNotes } from "./modelPdfNotes";
import useNewCoverages from "@/models/utils/useNewCoverages";

const atomFileTree = atom<FileTree>();
const atomCoverages = atom<Coverages>();
const atomPath = atom<string>();
const atomAppSettings = atom<AppSettings>();
const atomPdfLoaded = atom(false);

//|
//| 派生 atom
//|

const atomFileTreeValue = atom((get) => get(atomFileTree));
const atomCoveragesValue = atom((get) => get(atomCoverages));
const atomPdfLoadedValue = atom((get) => get(atomPdfLoaded));
const atomAppSettingsValue = atom((get) => get(atomAppSettings));
const atomJsonPathValue = atom((get) =>
  get(atomPath) ? get(atomPath) + ".json" : undefined,
);

const atomHandleValue = atom((get) => {
  const fileTree = get(atomFileTree);
  const path = get(atomPath);
  if (!fileTree || !path) return undefined;
  const item = findTreeItem(fileTree, path);
  if (!item || item.type !== "file") return undefined;
  return item.handle;
});

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

function useRenderPage() {
  const { queueRenderPage } = usePdf();
  const pdfNotes = useAtomValue(modelPdfNotes.pdfNotes.atom);
  return async () => {
    if (!pdfNotes) return;
    const pageNum = pdfNotes.currentPage;
    const offset = {
      top: pdfNotes.settings.offsetTop,
      bottom: pdfNotes.settings.offsetBottom,
    };
    await queueRenderPage(pageNum, offset);
  };
}

//|
//| export
//|

export const modelファイル = {
  fileTree: { atomValue: atomFileTreeValue },

  coverages: { atom: atomCoveragesValue, useSet: useSetCoverages },
  appSettings: { atom: atomAppSettingsValue, useSet: useSetAppSettings },

  pdf: {
    atomPath: atomPath,
    atomJsonPathValue: atomJsonPathValue,
    atomLoadedValue: atomPdfLoadedValue,
    useRenderPage,
  },
};

//|
//| watch
//|

const id = "modelPDFファイル";

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

// pdfPath 変更時の処理
watchMaps.pdfPath.set(id, () => {
  const setWaiting = useSetAtom(modelUI.waiting.atom);
  const { setPdfHandle } = usePdf();
  const handle = useAtomValue(atomHandleValue);
  const setOpenDrawer = useSetAtom(modelUI.openDrawer.pdfFileTree.atom);
  const setPdfLoaded = useSetAtom(atomPdfLoaded);
  const { add: addPdfHistory } = modelPDF履歴.update.use();

  return async (path) => {
    document.title = "NotesOnPDF";

    // PDF ファイル読み込み／アンロード
    setWaiting(true);
    setPdfLoaded(false);
    setPdfHandle(handle, (totalPages) => {
      setOpenDrawer(false);
      if (path && totalPages) void addPdfHistory(path, totalPages);
      setWaiting(false);
      setPdfLoaded(true);
      if (handle) document.title = handle.name;
    });
  };
});

// pdfNotes 変更時の処理
watchMaps.pdfNotes.set(id, () => {
  const setCoverages = modelファイル.coverages.useSet();
  const { getNewCoveragesOrUndefined } = useNewCoverages();
  const path = useAtomValue(atomPath);

  return (pdfNotes) => {
    // coverages の更新
    const newCoverages = getNewCoveragesOrUndefined(path, pdfNotes);
    if (newCoverages) {
      void setCoverages(newCoverages);
    }
  };
});
