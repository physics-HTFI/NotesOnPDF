import FileTree from "@/types/FileTree";
import Coverages from "@/types/Coverages";
import PdfNotes from "@/types/PdfNotes";
import AppSettings from "@/types/AppSettings";
import History from "@/types/History";
import { PageSize } from "@/contexts/PdfNotesContext";

export default interface IModel {
  getFlags(): ModelFlags;
  getMessage(reason: string): JSX.Element | undefined;

  getFileTree(): Promise<FileTree>;
  getHistory(): Promise<History>;
  updateHistory(id: string, pages: number): Promise<void>;
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
  canOpenHistory: boolean;
  canOpenFileDialog: boolean;
  canOpenGithub: boolean;
  usePdfjs: boolean;
}
