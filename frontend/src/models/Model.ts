import { FileTree } from "@/types/FileTree";
import { PdfInfo } from "@/types/PdfInfo";
import { Progresses } from "@/types/Progresses";
import IModel from "./IModel";
import { AppSettings } from "@/types/AppSettings";

export default class Model implements IModel {
  private wait = () => new Promise((resolve) => setTimeout(resolve, 300));
  //  private base = () => window.location.href.match(/.*:\d+/)?.[0];
  private base = () => "http://localhost:8080";

  public getFileTree = async (): Promise<FileTree> => {
    const res = await fetch(this.base() + "/api/file-tree");
    return (await res.json()) as FileTree;
  };

  public getProgresses = async (): Promise<Progresses> => {
    await this.wait();
    throw new Error();
  };
  putProgresses = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };

  getPdfInfo = async (): Promise<PdfInfo> => {
    await this.wait();
    throw new Error();
  };
  putPdfInfo = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };

  getAppSettings = async (): Promise<AppSettings> => {
    await this.wait();
    throw new Error();
  };
  putAppSettings = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };
}
