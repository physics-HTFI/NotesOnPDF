import { FileTree } from "@/types/FileTree";
import { PdfInfo, createNewPdfInfo } from "@/types/PdfInfo";
import { GetCoverages_empty, Coverages } from "@/types/Coverages";
import IModel from "./IModel";
import { AppSettings, GetAppSettings_default } from "@/types/AppSettings";

const ORIGIN = import.meta.env.DEV
  ? "http://localhost:8080"
  : window.location.href.match(/.*:\d+/)?.[0];

if (import.meta.env.DEV && import.meta.env.VITE_IS_MOCK !== "true") {
  console.log(`backend: ${ORIGIN}`);
}

export default class Model implements IModel {
  private getPutOptions = () =>
    ({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
    } as RequestInit);

  public getFileTree = async (): Promise<FileTree> => {
    const res = await fetch(ORIGIN + "/api/file-tree");
    const fileTree = (await res.json()) as FileTree;
    return fileTree;
  };

  public getCoverages = async (): Promise<Coverages> => {
    const res = await fetch(ORIGIN + "/api/coverage");
    return ((await res.json()) ?? GetCoverages_empty()) as Coverages;
  };
  putCoverages = async (progresses: Coverages): Promise<void> => {
    await fetch(ORIGIN + "/api/coverage", {
      ...this.getPutOptions(),
      body: JSON.stringify(progresses),
    });
  };

  getPdfInfo = async (id: string): Promise<PdfInfo> => {
    const res = await fetch(ORIGIN + `/api/pdf-notes/${id}`);
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
    await fetch(ORIGIN + `/api/pdf-notes/${id}`, {
      ...this.getPutOptions(),
      body: JSON.stringify(pdfNotes),
    });
  };

  getPageImage = (id: string, page: number, width: number) =>
    ORIGIN + `/api/images/${id}/${page}?width=${Math.floor(1.5 * width)}`;

  getAppSettings = async (): Promise<AppSettings> => {
    const res = await fetch(ORIGIN + "/api/app-settings");
    const appSettings = ((await res.json()) ??
      GetAppSettings_default()) as AppSettings;
    return appSettings;
  };
  putAppSettings = async (appSettings: AppSettings): Promise<void> => {
    await fetch(ORIGIN + "/api/app-settings", {
      ...this.getPutOptions(),
      body: JSON.stringify(appSettings),
    });
  };
}
