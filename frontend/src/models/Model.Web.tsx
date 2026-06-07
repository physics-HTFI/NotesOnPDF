import { findTreeItem, type FileTree } from "@/types/FileTree";
import type Coverages from "@/types/Coverages";
import { GetCoverages_empty } from "@/types/Coverages";
import type IModel from "./IModel";
import type { ResultGetPdfNotes } from "./IModel";
import type AppSettings from "@/types/AppSettings";
import { GetAppSettings_default } from "@/types/AppSettings";
import type PdfNotes from "@/types/PdfNotes";

const PATH_SETTINGS = ".NotesOnPDF/settings.json";
const PATH_COVERAGES = ".NotesOnPDF/coverages.json";

export default class ModelWeb implements IModel {
  constructor(private dirHandle: FileSystemDirectoryHandle) {
    this.fileTree = undefined;
  }

  getFileHandleFromPath = (path?: string) => {
    if (!this.fileTree || !path) return undefined;
    const item = findTreeItem(this.fileTree, path);
    if (!item || item.type !== "file") return undefined;
    return item.handle;
  };

  getCoverages = async () => {
    try {
      return JSON.parse(
        await this._getTextFromPath(PATH_COVERAGES),
      ) as Coverages;
    } catch {
      return GetCoverages_empty();
    }
  };
  putCoverages = async (coverages: Coverages) => {
    await this._writeToPath(PATH_COVERAGES, JSON.stringify(coverages, null, 2));
  };

  getPdfNotes = async (path: string): Promise<ResultGetPdfNotes> => {
    const { name, jsonPath } = this._parsePath(path);
    try {
      return {
        name,
        pdfNotes: JSON.parse(await this._getTextFromPath(jsonPath)) as PdfNotes,
      };
    } catch {
      return { name };
    }
  };
  putPdfNotes = async (path: string, pdfNotes: PdfNotes) => {
    const { jsonPath } = this._parsePath(path);
    await this._writeToPath(jsonPath, JSON.stringify(pdfNotes));
  };

  getPageImageUrl = () => "";

  getAppSettings = async () => {
    try {
      return JSON.parse(
        await this._getTextFromPath(PATH_SETTINGS),
      ) as AppSettings;
    } catch {
      return GetAppSettings_default();
    }
  };
  putAppSettings = async (appSettings: AppSettings) => {
    await this._writeToPath(
      PATH_SETTINGS,
      JSON.stringify(appSettings, null, 2),
    );
  };

  //|
  //| private
  //|

  private fileTree: FileTree | undefined;

  private _getFileHandleFromPath = async (
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

  private _getTextFromPath = async (path: string): Promise<string> => {
    const fileHandle = await this._getFileHandleFromPath(path, false);
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

  private _writeToPath = async (path: string, text: string): Promise<void> => {
    const fileHandle = await this._getFileHandleFromPath(path, true);
    const file = await fileHandle.createWritable();
    await file.write(text);
    await file.close();
  };

  private _parsePath = (path: string) => {
    const match = path.match(/([^/]+)\.[^.]*$/);
    const [name, jsonPath] = [match?.[1], `${path}.json`];
    if (!name) throw new Error();
    return { name, jsonPath };
  };
}
