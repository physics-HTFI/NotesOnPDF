import { FileTree } from "../types/FileTree";
import { PDFsInfo } from "../types/PDFsInfo";

export default interface IModel {
  getFileTree(): Promise<FileTree>;
  getPDFsInfo(): Promise<PDFsInfo>;
}
