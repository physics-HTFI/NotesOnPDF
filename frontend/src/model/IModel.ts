import { FileTree } from "../types/FileTree";

export default interface IModel {
  getFiles(dirname: string): Promise<FileTree>;
}
