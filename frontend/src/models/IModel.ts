import { FileTree } from "@/types/FileTree";
import { Progresses } from "@/types/Progresses";
import { PdfInfo } from "@/types/PdfInfo";

export default interface IModel {
  getFileTree(): Promise<FileTree>;
  getProgresses(): Promise<Progresses>;
  getPdfInfo(path: string): Promise<PdfInfo | null>;
}
