import FileTree from "@/types/FileTree";
import PdfNotes from "@/types/PdfNotes";
import Coverages, { GetCoverages_empty } from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import AppSettings, { GetAppSettings_default } from "@/types/AppSettings";
import History from "@/types/History";
import { PageSize } from "@/contexts/PdfNotesContext/PdfNotesContext";

export default class ModelDesktop implements IModel {
  private origin = import.meta.env.DEV ? "http://localhost:8000" : "";

  getFlags = () => ({
    isMock: false,
    canOpenFileDialog: true,
    canOpenGithub: false,
  });

  getEventSource = () =>
    new EventSource(this.origin + "/api/server-sent-events");

  getFileTree = async (): Promise<FileTree> => {
    const res = await fetch(this.origin + "/api/file-tree");
    if (!res.ok) return Promise.reject();
    const fileTree = (await res.json()) as FileTree;
    return fileTree;
  };

  getHistory = async (): Promise<History> => {
    const res = await fetch(this.origin + "/api/history");
    if (!res.ok) return Promise.reject();
    const history = (await res.json()) as History;
    return history;
  };
  updateHistory = () => Promise.reject();
  deleteHistoryAll = async () => {
    const res = await fetch(this.origin + "/api/history", {
      method: "DELETE",
    });
    if (!res.ok) return Promise.reject();
  };
  deleteHistory = async (id: string) => {
    const res = await fetch(this.origin + `/api/history/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return Promise.reject();
  };

  getIdFromExternalFile = async (): Promise<string> => {
    const res = await fetch(this.origin + "/api/external-pdf-id");
    if (!res.ok) return Promise.reject();
    const id = (await res.json()) as string;
    return id;
  };

  getIdFromUrl = async (url: string): Promise<string> => {
    const res = await fetch(
      this.origin + `/api/web-pdf-id?${encodeURIComponent(url)}`
    );
    if (!res.ok) return Promise.reject();
    const id = (await res.json()) as string;
    return id;
  };

  getFileFromId = () => Promise.reject();

  getCoverages = async (): Promise<Coverages> => {
    const res = await fetch(this.origin + "/api/coverage");
    if (!res.ok) return Promise.reject();
    return ((await res.json()) ?? GetCoverages_empty()) as Coverages;
  };
  putCoverages = async (coverages: Coverages): Promise<void> => {
    const res = await fetch(this.origin + "/api/coverage", {
      method: "PUT",
      body: JSON.stringify(coverages, null, 2),
    });
    if (!res.ok) return Promise.reject();
  };

  getPdfNotes = async (id: string): Promise<ResultGetPdfNotes> => {
    const res = await fetch(
      this.origin + `/api/notes/${encodeURIComponent(id)}`
    );
    if (!res.ok) return Promise.reject();
    const { name, pageSizes, pdfNotes } = (await res.json()) as {
      name: string;
      pageSizes: PageSize[];
      pdfNotes?: string;
    };
    return {
      name,
      pageSizes,
      pdfNotes: pdfNotes ? (JSON.parse(pdfNotes) as PdfNotes) : undefined,
    };
  };
  putPdfNotes = async (id: string, pdfNotes: PdfNotes): Promise<void> => {
    const res = await fetch(this.origin + `/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(pdfNotes),
    });
    if (!res.ok) return Promise.reject();
  };

  getPageImageUrl = (id: string, page: number, width: number, height: number) =>
    this.origin + `/api/images/${id}/${page}?width=${width}&height=${height}`;

  getAppSettings = async (): Promise<AppSettings> => {
    const res = await fetch(this.origin + "/api/settings");
    if (!res.ok) return Promise.reject();
    const appSettings = ((await res.json()) ??
      GetAppSettings_default()) as AppSettings;
    return appSettings;
  };
  putAppSettings = async (appSettings: AppSettings): Promise<void> => {
    const res = await fetch(this.origin + "/api/settings", {
      method: "PUT",
      body: JSON.stringify(appSettings, null, 2),
    });
    if (!res.ok) return Promise.reject();
  };
}
