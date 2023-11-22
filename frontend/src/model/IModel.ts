import { FileTree } from "../types/FileTree";
import { Progresses } from "../types/Progresses";
import { PDF } from "../types/PDF";

export default interface IModel {
  getFileTree(): Promise<FileTree>;
  getProgresses(): Promise<Progresses>;
  getPDF(path: string, numPages: number): Promise<PDF>;
}
