import { FileTree } from "@/types/FileTree";
import { PdfInfo, createNewPdfInfo } from "@/types/PdfInfo";
import { GetProgresses_empty, Progresses } from "@/types/Progresses";
import IModel from "./IModel";
import { AppSettings, GetAppSettings_default } from "@/types/AppSettings";

export default class Model implements IModel {
  private wait = () => new Promise((resolve) => setTimeout(resolve, 300));
  //  private base = () => window.location.href.match(/.*:\d+/)?.[0];
  private base = () => "http://localhost:8080";

  public getFileTree = async (): Promise<FileTree> => {
    const res = await fetch(this.base() + "/api/file-tree");
    const fileTree = (await res.json()) as FileTree;
    return fileTree;
  };

  public getProgresses = async (): Promise<Progresses> => {
    const res = await fetch(this.base() + "/api/coverage");
    return ((await res.json()) ?? GetProgresses_empty()) as Progresses;
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

  getPageImage = (id: string, page: number, width: number) =>
    this.base() + `/api/images/${id}/${page}?width=${Math.floor(1.5 * width)}`;

  getAppSettings = async (): Promise<AppSettings> => {
    const res = await fetch(this.base() + "/api/app-settings");
    const appSettings = ((await res.json()) ??
      GetAppSettings_default()) as AppSettings;
    return appSettings;
  };
  putAppSettings = async (appSettings: AppSettings): Promise<void> => {
    await fetch(this.base() + "/api/app-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(appSettings),
    });
  };
}
