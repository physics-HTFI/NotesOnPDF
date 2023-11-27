import { FileTree } from "../types/FileTree";
import { Progresses } from "../types/Progresses";
import { Notes } from "../types/Notes";

export default interface IModel {
  getFileTree(): Promise<FileTree>;
  getProgresses(): Promise<Progresses>;
  getNotes(path: string): Promise<Notes | null>;
}
