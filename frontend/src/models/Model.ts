import { FileTree } from "@/types/FileTree";
import { PdfInfo } from "@/types/PdfInfo";
import { Progresses } from "@/types/Progresses";
import IModel from "./IModel";
import { AppSettings } from "@/types/AppSettings";

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

  getPdfInfo = async (): Promise<PdfInfo> => {
    await this.wait();
    throw new Error();
  };

  getAppSettings = async (): Promise<AppSettings> => {
    await this.wait();
    throw new Error();
  };
}
