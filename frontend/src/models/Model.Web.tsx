import {
  findTreeItem,
  type FileTree,
  type FileTreeItemPdf,
} from "@/types/FileTree";
import type Coverages from "@/types/Coverages";
import { GetCoverages_empty } from "@/types/Coverages";
import type IModel from "./IModel";
import type { ResultGetPdfNotes } from "./IModel";
import type AppSettings from "@/types/AppSettings";
import { GetAppSettings_default } from "@/types/AppSettings";
import { type History, updateHistory } from "@/types/History";
import type PdfNotes from "@/types/PdfNotes";

const PATH_SETTINGS = ".NotesOnPDF/settings.json";
const PATH_COVERAGES = ".NotesOnPDF/coverages.json";
const PATH_HISTORY = ".NotesOnPDF/history.web.json";

export default class ModelWeb implements IModel {
  constructor(private dirHandle: FileSystemDirectoryHandle) {
    const getHistory = async () =>
      JSON.parse(await this.getTextFromPath(PATH_HISTORY)) as History;

    this.fileTree = undefined;
    this.history = [];
    getHistory()
      .then((h) => (this.history = h))
      .catch(() => undefined);
  }

  getFlags = () => ({
    canOpenFileDialog: false,
    canOpenGithub: true,
  });
  getEventSource = () => undefined;

  getFileTree = async () => {
    const fileTree: FileTree = {
      type: "folder",
      path: "/",
      name: "root",
      handle: this.dirHandle,
      children: [],
    };
    await addEntries(fileTree, this.dirHandle);
    this.fileTree = fileTree;
    return fileTree;

    async function addEntries(
      fileTree: FileTree,
      dHandle: FileSystemDirectoryHandle,
    ) {
      // フォルダを追加
      for await (const [name, handle] of dHandle) {
        if (handle.kind === "directory") {
          const path = `${fileTree.path}/${name}/`;
          const entry: FileTree = {
            type: "folder",
            path,
            name,
            handle,
            children: [],
          };
          await addEntries(entry, handle);
          if (entry.children.length === 0) continue; // 空ディレクトリは、ファイルツリー上でPDFファイルとして表示されてしまうので取り除く
          fileTree.children.push(entry);
        }
      }
      // ファイルを追加（フォルダの後ろに追加する）
      for await (const [name, handle] of dHandle) {
        if (handle.kind === "file") {
          if (!name.toLowerCase().endsWith(".pdf")) continue;
          const path = `${fileTree.path}/${name}`;
          const entry: FileTreeItemPdf = { type: "file", path, name, handle };
          fileTree.children.push(entry);
        }
      }
    }
  };

  getHistory = async () => Promise.resolve(this.history);
  updateHistory = async (path: string, pages: number) => {
    this.history = updateHistory(this.history, path, pages);
    await this.writeToPath(PATH_HISTORY, JSON.stringify(this.history, null, 2));
  };
  deleteHistoryAll = async () => {
    this.history = [];
    await this.writeToPath(PATH_HISTORY, JSON.stringify(this.history, null, 2));
  };
  deleteHistory = async (id: string) => {
    this.history = this.history.filter((h) => h.path !== id);
    await this.writeToPath(PATH_HISTORY, JSON.stringify(this.history, null, 2));
  };

  getIdFromExternalFile = () => Promise.reject();
  getIdFromUrl = () => Promise.reject();
  getFileFromPath = async (path: string) => {
    if (!this.fileTree) return Promise.reject();
    const item = findTreeItem(this.fileTree, path);
    if (!item || item.type !== "file") return Promise.reject();
    return item.handle.getFile();
  };

  getCoverages = async () => {
    try {
      return JSON.parse(
        await this.getTextFromPath(PATH_COVERAGES),
      ) as Coverages;
    } catch {
      return GetCoverages_empty();
    }
  };
  putCoverages = async (coverages: Coverages) => {
    await this.writeToPath(PATH_COVERAGES, JSON.stringify(coverages, null, 2));
  };

  getPdfNotes = async (path: string): Promise<ResultGetPdfNotes> => {
    const { name, jsonPath } = this.parsePath(path);
    try {
      return {
        name,
        pdfNotes: JSON.parse(await this.getTextFromPath(jsonPath)) as PdfNotes,
      };
    } catch {
      return { name };
    }
  };
  putPdfNotes = async (path: string, pdfNotes: PdfNotes) => {
    const { jsonPath } = this.parsePath(path);
    await this.writeToPath(jsonPath, JSON.stringify(pdfNotes));
  };

  getPageImageUrl = () => "";

  getAppSettings = async () => {
    try {
      return JSON.parse(
        await this.getTextFromPath(PATH_SETTINGS),
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

  private fileTree: FileTree | undefined;
  private history: History;

  private getFileHandleFromPath = async (
    path: string,
    create: boolean,
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

  private parsePath = (path: string) => {
    const match = path.match(/([^/]+)\.[^.]*$/);
    const [name, jsonPath] = [match?.[1], `${path}.json`];
    if (!name) throw new Error();
    return { name, jsonPath };
  };
}
