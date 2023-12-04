import { FileTree } from "@/types/FileTree";
import { Notes } from "@/types/Notes";
import { Progresses } from "@/types/Progresses";
import IModel from "./IModel";

export default class Model implements IModel {
  private wait = () => new Promise((resolve) => setTimeout(resolve, 300));

  public getFileTree = async (): Promise<FileTree> => {
    await this.wait();
    throw new Error();
  };

  public getProgresses = async (): Promise<Progresses> => {
    await this.wait();
    throw new Error();
  };

  getNotes = async (): Promise<Notes> => {
    await this.wait();
    throw new Error();
  };
}
