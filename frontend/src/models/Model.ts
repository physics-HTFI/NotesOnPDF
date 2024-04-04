import { FileTree } from "@/types/FileTree";
import { Page, PdfInfo } from "@/types/PdfInfo";
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
    const res = await fetch(this.base() + "/api/coverage");
    return (await res.json()) as Progresses;
  };
  putProgresses = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };

  getPdfInfo = async (id: string): Promise<PdfInfo> => {
    const res = await fetch(this.base() + `/api/pdf-notes/${id}`);
    // 注釈ファイルが存在する場合はそれを、しない場合はPDFのページサイズの配列を受け取る
    const pdfInfoOrPageSizes = (await res.json()) as
      | PdfInfo
      | { width: number; height: number }[];
    if ("pages" in pdfInfoOrPageSizes) return pdfInfoOrPageSizes;
    return {
      currentPage: 0,
      settings: {
        fontSize: 70,
        offsetTop: 0.0,
        offsetBottom: 0.0,
      },
      pages: pdfInfoOrPageSizes.map<Page>((_, j) => ({ num: j + 1 })),
    };
  };
  putPdfInfo = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };

  getAppSettings = async (): Promise<AppSettings> => {
    const res = await fetch(this.base() + "/api/app-settings");
    return (await res.json()) as AppSettings;
  };
  putAppSettings = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };
}
