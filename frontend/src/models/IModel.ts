import type { FileTree } from "@/types/FileTree";
import type Coverages from "@/types/Coverages";
import type PdfNotes from "@/types/PdfNotes";
import type AppSettings from "@/types/AppSettings";
import type { History } from "@/types/History";

export default interface IModel {
  getFlags(): ModelFlags;
  getEventSource(): EventSource | undefined;

  getFileTree(): Promise<FileTree | undefined>;

  getHistory(): Promise<History>;
  updateHistory(path: string, pages: number): Promise<void>;
  deleteHistoryAll(): Promise<void>;
  deleteHistory(path: string): Promise<void>;

  getIdFromExternalFile(): Promise<string>;
  getIdFromUrl(url: string): Promise<string>;
  getFileHandleFromPath(path?: string): FileSystemFileHandle | undefined;

  getCoverages(): Promise<Coverages>;
  putCoverages(coverages: Coverages): Promise<void>;

  getPdfNotes(path: string): Promise<ResultGetPdfNotes>;
  putPdfNotes(path: string, pdfNotes: PdfNotes): Promise<void>;

  getPageImageUrl(
    path: string,
    page: number,
    width: number,
    height: number,
  ): string;

  getAppSettings(): Promise<AppSettings>;
  putAppSettings(appSettings: AppSettings): Promise<void>;
}

export interface ResultGetPdfNotes {
  name: string;
  pages?: number;
  pdfNotes?: PdfNotes;
}

export interface ModelFlags {
  canOpenFileDialog: boolean;
}
