import { FileTree } from "@/types/FileTree";
import { Progresses } from "@/types/Progresses";
import { PdfInfo } from "@/types/PdfInfo";
import { AppSettings } from "@/types/AppSettings";

export default interface IModel {
  getFileTree(rootPath: string): Promise<FileTree>;
  getProgresses(): Promise<Progresses>;
  getPdfInfo(path: string): Promise<PdfInfo | null>;
  getAppSettings(): Promise<AppSettings>;
}
