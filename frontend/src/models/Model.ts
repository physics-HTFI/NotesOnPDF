import { FileTree } from "@/types/FileTree";
import { PdfNotes } from "@/types/PdfNotes";
import { GetCoverages_empty, Coverages } from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import { AppSettings, GetAppSettings_default } from "@/types/AppSettings";
import { History } from "@/types/History";

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

  getFileTree = async (): Promise<FileTree> => {
    const res = await fetch(ORIGIN + "/api/files");
    const fileTree = (await res.json()) as FileTree;
    return fileTree;
  };

  getHistory = async (): Promise<History> => {
    const res = await fetch(ORIGIN + "/api/history");
    const history = (await res.json()) as History;
    return history;
  };

  getIdFromExternalFile = async (): Promise<string> => {
    const res = await fetch(ORIGIN + "/api/external-pdf-id");
    const id = (await res.json()) as string;
    return id;
  };

  getIdFromUrl = async (url: string): Promise<string> => {
    const res = await fetch(
      ORIGIN + `/api/web-pdf-id?${encodeURIComponent(url)}`
    );
    const id = (await res.json()) as string;
    return id;
  };

  getCoverages = async (): Promise<Coverages> => {
    const res = await fetch(ORIGIN + "/api/coverage");
    return ((await res.json()) ?? GetCoverages_empty()) as Coverages;
  };
  putCoverages = async (progresses: Coverages): Promise<void> => {
    await fetch(ORIGIN + "/api/coverage", {
      ...this.getPutOptions(),
      body: JSON.stringify(progresses, null, 2),
    });
  };

  getPdfNotes = async (id: string): Promise<ResultGetPdfNotes> => {
    const res = await fetch(ORIGIN + `/api/notes/${id}`);
    const { name, sizes, notes } = (await res.json()) as {
      name: string;
      sizes: { width: number; height: number }[];
      notes?: string;
    };
    return {
      name,
      sizes,
      notes: notes ? (JSON.parse(notes) as PdfNotes) : undefined,
    };
  };
  putPdfNotes = async (id: string, pdfNotes: PdfNotes): Promise<void> => {
    await fetch(ORIGIN + `/api/notes/${id}`, {
      ...this.getPutOptions(),
      body: JSON.stringify(pdfNotes, null, 2),
    });
  };

  getPageImageUrl = (id: string, page: number, width: number) =>
    ORIGIN + `/api/images/${id}/${page}?width=${Math.floor(1.5 * width)}`;

  getAppSettings = async (): Promise<AppSettings> => {
    const res = await fetch(ORIGIN + "/api/settings");
    const appSettings = ((await res.json()) ??
      GetAppSettings_default()) as AppSettings;
    return appSettings;
  };
  putAppSettings = async (appSettings: AppSettings): Promise<void> => {
    await fetch(ORIGIN + "/api/settings", {
      ...this.getPutOptions(),
      body: JSON.stringify(appSettings, null, 2),
    });
  };
}
