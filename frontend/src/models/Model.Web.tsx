import FileTree, { FileTreeEntry, GetFileTreeRoot } from "@/types/FileTree";
import Coverages, { GetCoverages_empty } from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import AppSettings, { GetAppSettings_default } from "@/types/AppSettings";
import History from "@/types/History";
import PdfNotes from "@/types/PdfNotes";

const PATH_SETTINGS = ".NotesOnPDF/settings.json";
const PATH_COVERAGES = ".NotesOnPDF/coverages.json";
const PATH_HISTORY = ".NotesOnPDF/history.web.json";

export default class ModelWeb implements IModel {
  constructor(private dirHandle: FileSystemDirectoryHandle) {}

  getFlags = () => ({
    canToggleReadOnly: true,
    canOpenHistory: true,
    canOpenFileDialog: false,
    canOpenGithub: true,
    usePdfjs: true,
  });
  getMessage = (reason: string) => <>{`${reason}に失敗しました`}</>;

  getFileTree = async (): Promise<FileTree> => {
    const root = GetFileTreeRoot();
    const fileTree: FileTree = [root];
    await addEntries(fileTree, root, this.dirHandle);
    return removeEmptyDirectories(fileTree);

    async function addEntries(
      fileTree: FileTree,
      root: FileTreeEntry,
      dHandle: FileSystemDirectoryHandle
    ) {
      for await (const [name, handle] of dHandle) {
        const path = !root.path ? name : `${root.path}/${name}`;
        const entry: FileTreeEntry = { id: path, path, children: null };
        if (handle.kind === "file") {
          if (!name.toLowerCase().endsWith(".pdf")) continue;
        } else {
          entry.children = [];
          await addEntries(fileTree, entry, handle);
        }
        root.children?.push(path);
        fileTree.push(entry);
      }
    }
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
  getHistory = async (): Promise<History> => {
    try {
      return JSON.parse(await this.getTextFromPath(PATH_HISTORY)) as History;
    } catch {
      return [];
    }
  };
  getIdFromExternalFile = () => Promise.reject();
  getIdFromUrl = () => Promise.reject();
  getFileFromId = async (id: string) => {
    const fileHandle = await this.getFileHandleFromPath(id, false);
    return await fileHandle.getFile();
  };

  getCoverages = async (): Promise<Coverages> => {
    try {
      return JSON.parse(
        await this.getTextFromPath(PATH_COVERAGES)
      ) as Coverages;
    } catch {
      return GetCoverages_empty();
    }
  };
  putCoverages = async (coverages: Coverages): Promise<void> => {
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
  putPdfNotes = async (id: string, pdfNotes: PdfNotes): Promise<void> => {
    const { jsonPath } = ModelWeb.parseId(id);
    await this.writeToPath(jsonPath, JSON.stringify(pdfNotes));
  };

  getPageImageUrl = () => "";

  getAppSettings = async (): Promise<AppSettings> => {
    try {
      return JSON.parse(
        await this.getTextFromPath(PATH_SETTINGS)
      ) as AppSettings;
    } catch {
      return GetAppSettings_default();
    }
  };
  putAppSettings = async (appSettings: AppSettings): Promise<void> => {
    await this.writeToPath(PATH_SETTINGS, JSON.stringify(appSettings, null, 2));
  };

  //|
  //| private
  //|

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
}
