import FileTree, { FileTreeEntry, GetFileTreeRoot } from "@/types/FileTree";
import Coverages, { GetCoverages_empty } from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import AppSettings, { GetAppSettings_default } from "@/types/AppSettings";
import History, { HistoryEntry } from "@/types/History";
import PdfNotes from "@/types/PdfNotes";

const PATH_SETTINGS = ".NotesOnPDF/settings.json";
const PATH_COVERAGES = ".NotesOnPDF/coverages.json";
const PATH_HISTORY = ".NotesOnPDF/history.web.json";

export default class ModelWeb implements IModel {
  constructor(private dirHandle: FileSystemDirectoryHandle) {
    const getHistory = async () =>
      JSON.parse(await this.getTextFromPath(PATH_HISTORY)) as History;

    this.history = [];
    getHistory()
      .then((h) => (this.history = h))
      .catch(() => undefined);
  }

  getFlags = () => ({
    canToggleReadOnly: true,
    canOpenHistory: true,
    canOpenFileDialog: false,
    canOpenGithub: true,
    usePdfjs: true,
  });
  getMessage = (reason: string) => <>{`${reason}に失敗しました`}</>;

  getFileTree = async () => {
    const root = GetFileTreeRoot();
    const fileTree: FileTree = [root];
    await addEntries(fileTree, root, this.dirHandle);
    return removeEmptyDirectories(fileTree);

    async function addEntries(
      fileTree: FileTree,
      root: FileTreeEntry,
      dHandle: FileSystemDirectoryHandle
    ) {
// フォルダを追加
      for await (const [name, handle] of dHandle) {
if (handle.kind === "directory") {
        const path = !root.path ? name : `${root.path}/${name}`;
        const entry: FileTreeEntry = { id: path, path, children: [] };
await addEntries(fileTree, entry, handle);
          root.children?.push(path);
          fileTree.push(entry);
        }
      }
      // ファイルを追加（フォルダの後ろに追加する）
      for await (const [name, handle] of dHandle) {
        if (handle.kind === "file") {
          if (!name.toLowerCase().endsWith(".pdf")) continue;
        const path = !root.path ? name : `${root.path}/${name}`;
          const entry: FileTreeEntry = { id: path, path, children: null };
          root.children?.push(path);
        fileTree.push(entry);
}
      }
    }
    // 空ディレクトリがあるとファイルツリー上でPDFファイルとして表示されてしまうので取り除く
    function removeEmptyDirectories(fileTree: FileTree): FileTree {
      for (;;) {
        const length = fileTree.length;
        fileTree = fileTree.filter((e) => e.children?.length !== 0);
        for (const entry of fileTree) {
          if (!entry.children) continue;
          entry.children = entry.children.filter((id) =>
            fileTree.find((e) => e.id === id)
          );
        }
        if (length === fileTree.length) break;
      }
      return fileTree;
    }
  };
  getHistory = async () => Promise.resolve(this.history);
  updateHistory = async (id: string, pages: number) => {
    const entry: HistoryEntry = {
      id,
      name: id.split("/").pop() ?? "",
      pages: String(pages),
      origin: "ツリー内",
      accessDate: ModelWeb.now(),
    };
    this.history = this.history.filter((e) => e.id !== entry.id);
    this.history = [entry, ...this.history];
    await this.writeToPath(PATH_HISTORY, JSON.stringify(this.history, null, 2));
  };
  getIdFromExternalFile = () => Promise.reject();
  getIdFromUrl = () => Promise.reject();
  getFileFromId = async (id: string) => {
    const fileHandle = await this.getFileHandleFromPath(id, false);
    return await fileHandle.getFile();
  };

  getCoverages = async () => {
    try {
      return JSON.parse(
        await this.getTextFromPath(PATH_COVERAGES)
      ) as Coverages;
    } catch {
      return GetCoverages_empty();
    }
  };
  putCoverages = async (coverages: Coverages) => {
    await this.writeToPath(PATH_COVERAGES, JSON.stringify(coverages, null, 2));
  };

  getPdfNotes = async (id: string): Promise<ResultGetPdfNotes> => {
    const { name, jsonPath } = ModelWeb.parseId(id);
    try {
      return {
        name,
        pdfNotes: JSON.parse(await this.getTextFromPath(jsonPath)) as PdfNotes,
      };
    } catch {
      return { name };
    }
  };
  putPdfNotes = async (id: string, pdfNotes: PdfNotes) => {
    const { jsonPath } = ModelWeb.parseId(id);
    await this.writeToPath(jsonPath, JSON.stringify(pdfNotes));
  };

  getPageImageUrl = () => "";

  getAppSettings = async () => {
    try {
      return JSON.parse(
        await this.getTextFromPath(PATH_SETTINGS)
      ) as AppSettings;
    } catch {
      return GetAppSettings_default();
    }
  };
  putAppSettings = async (appSettings: AppSettings) => {
    await this.writeToPath(PATH_SETTINGS, JSON.stringify(appSettings, null, 2));
  };

  //|
  //| private
  //|

  private history: History;

  private getFileHandleFromPath = async (
    path: string,
    create: boolean
  ): Promise<FileSystemFileHandle> => {
    const breadcrumb = path.split("/");
    const name = breadcrumb.pop();
    if (!name) return Promise.reject();
    let handle = this.dirHandle;
    for (const dir of breadcrumb) {
      handle = await handle.getDirectoryHandle(dir, { create });
    }
    return await handle.getFileHandle(name, { create });
  };

  private getTextFromPath = async (path: string): Promise<string> => {
    const fileHandle = await this.getFileHandleFromPath(path, false);
    const file = await fileHandle.getFile();
    const promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
    return await promise;
  };

  private writeToPath = async (path: string, text: string): Promise<void> => {
    const fileHandle = await this.getFileHandleFromPath(path, true);
    const file = await fileHandle.createWritable();
    await file.write(text);
    await file.close();
  };

  private static parseId = (id: string) => {
    const match = id.match(/([^/]+)\.[^.]*$/);
    const [name, jsonPath] = [match?.[1], `${id}.json`];
    if (!name) throw new Error();
    return { name, jsonPath };
  };

  private static now = () =>
    new Date()
      .toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-");
}
