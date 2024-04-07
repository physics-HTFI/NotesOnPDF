import { FileTree } from "@/types/FileTree";
import { PdfInfo, createNewPdfInfo } from "@/types/PdfInfo";
import { GetCoverages_empty, Coverages } from "@/types/Coverages";
import IModel from "./IModel";
import { AppSettings, GetAppSettings_default } from "@/types/AppSettings";

export default class Model implements IModel {
  //  private base = () => window.location.href.match(/.*:\d+/)?.[0];
  private base = () => "http://localhost:8080";
  private getPutOptions = () =>
    ({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
    } as RequestInit);

  public getFileTree = async (): Promise<FileTree> => {
    const res = await fetch(this.base() + "/api/file-tree");
    const fileTree = (await res.json()) as FileTree;
    return fileTree;
  };

  public getCoverages = async (): Promise<Coverages> => {
    const res = await fetch(this.base() + "/api/coverage");
    return ((await res.json()) ?? GetCoverages_empty()) as Coverages;
  };
  putCoverages = async (progresses: Coverages): Promise<void> => {
    await fetch(this.base() + "/api/coverage", {
      ...this.getPutOptions(),
      body: JSON.stringify(progresses),
    });
  };

  getPdfInfo = async (id: string): Promise<PdfInfo> => {
    const res = await fetch(this.base() + `/api/pdf-notes/${id}`);
    const pdfInfoAndSizes = (await res.json()) as {
      sizes: { width: number; height: number }[];
      notes?: string;
    };
    if (pdfInfoAndSizes.notes)
      return JSON.parse(pdfInfoAndSizes.notes) as PdfInfo;
    return createNewPdfInfo(
      pdfInfoAndSizes.sizes.map((s) => s.width / s.height)
    );
  };
  putPdfInfo = async (id: string, pdfNotes: PdfInfo): Promise<void> => {
    await fetch(this.base() + `/api/pdf-notes/${id}`, {
      ...this.getPutOptions(),
      body: JSON.stringify(pdfNotes),
    });
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
      ...this.getPutOptions(),
      body: JSON.stringify(appSettings),
    });
  };
}
