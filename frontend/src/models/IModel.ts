import FileTree from "@/types/FileTree";
import Coverages from "@/types/Coverages";
import PdfNotes from "@/types/PdfNotes";
import AppSettings from "@/types/AppSettings";
import History from "@/types/History";
import { PageSize } from "@/contexts/PdfNotesContext/PdfNotesContext";

export default interface IModel {
  getFlags(): ModelFlags;
  getEventSource(): EventSource | undefined;

  getFileTree(): Promise<FileTree>;

  getHistory(): Promise<History>;
  updateHistory(id: string, pages: number): Promise<void>;
  deleteHistoryAll(): Promise<void>;
  deleteHistory(id: string): Promise<void>;

  getIdFromExternalFile(): Promise<string>;
  getIdFromUrl(url: string): Promise<string>;
  getFileFromId(id: string): Promise<string | File>;

  getCoverages(): Promise<Coverages>;
  putCoverages(coverages: Coverages): Promise<void>;

  getPdfNotes(id: string): Promise<ResultGetPdfNotes>;
  putPdfNotes(id: string, pdfNotes: PdfNotes): Promise<void>;

  getPageImageUrl(
    id: string,
    page: number,
    width: number,
    height: number
  ): string;

  getAppSettings(): Promise<AppSettings>;
  putAppSettings(appSettings: AppSettings): Promise<void>;
}

export interface ResultGetPdfNotes {
  name: string;
  pageSizes?: PageSize[];
  pdfNotes?: PdfNotes;
}

export interface ModelFlags {
  canToggleReadOnly: boolean;
  canOpenFileDialog: boolean;
  canOpenGithub: boolean;
}
