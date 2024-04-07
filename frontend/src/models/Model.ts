import { FileTree } from "@/types/FileTree";
import { PdfInfo, createNewPdfInfo } from "@/types/PdfInfo";
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
    const pdfInfoAndSizes = (await res.json()) as {
      sizes: { width: number; height: number }[];
      notes?: PdfInfo;
    };
    if (pdfInfoAndSizes.notes) return pdfInfoAndSizes.notes;
    return createNewPdfInfo(
      pdfInfoAndSizes.sizes.map((s) => s.width / s.height)
    );
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
