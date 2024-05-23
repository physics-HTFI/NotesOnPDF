import FileTree from "@/types/FileTree";
import PdfNotes from "@/types/PdfNotes";
import Coverages, { GetCoverages_empty } from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import AppSettings, { GetAppSettings_default } from "@/types/AppSettings";
import History from "@/types/History";
import { PageSize } from "@/contexts/PdfNotesContext";

const ORIGIN = import.meta.env.DEV
  ? "http://localhost:8080"
  : window.location.href.match(/.*:\d+/)?.[0];

export default class ModelDesktop implements IModel {
  private getPutOptions = () =>
    ({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
    } as RequestInit);

  getFlags = () => ({
    canToggleReadOnly: true,
    canOpenHistory: true,
    canOpenFileDialog: true,
    canOpenGithub: false,
    usePdfjs: false,
  });

  getMessage = (reason: string) => (
    <>
      {`${reason}に失敗しました`}
      <br />
      NotesOnPdf.exeが起動していないか、入力が不正です
    </>
  );

  getFileTree = async (): Promise<FileTree> => {
    const res = await fetch(ORIGIN + "/api/files");
    if (!res.ok) return Promise.reject();
    const fileTree = (await res.json()) as FileTree;
    return fileTree;
  };

  getHistory = async (): Promise<History> => {
    const res = await fetch(ORIGIN + "/api/history");
    if (!res.ok) return Promise.reject();
    const history = (await res.json()) as History;
    return history;
  };
  updateHistory = () => Promise.reject();
  clearHistory = async () => {
    // バックエンド側で{method: "DELETE"}を受け取る方法が不明なので、POSTで対応する。
    const res = await fetch(ORIGIN + "/api/history/delete", {
      ...this.getPutOptions(),
    });
    if (!res.ok) return Promise.reject();
  };

  getIdFromExternalFile = async (): Promise<string> => {
    const res = await fetch(ORIGIN + "/api/external-pdf-id");
    if (!res.ok) return Promise.reject();
    const id = (await res.json()) as string;
    return id;
  };

  getIdFromUrl = async (url: string): Promise<string> => {
    const res = await fetch(
      ORIGIN + `/api/web-pdf-id?${encodeURIComponent(url)}`
    );
    if (!res.ok) return Promise.reject();
    const id = (await res.json()) as string;
    return id;
  };

  getFileFromId = () => Promise.reject();

  getCoverages = async (): Promise<Coverages> => {
    const res = await fetch(ORIGIN + "/api/coverage");
    if (!res.ok) return Promise.reject();
    return ((await res.json()) ?? GetCoverages_empty()) as Coverages;
  };
  putCoverages = async (coverages: Coverages): Promise<void> => {
    const res = await fetch(ORIGIN + "/api/coverage", {
      ...this.getPutOptions(),
      body: JSON.stringify(coverages, null, 2),
    });
    if (!res.ok) return Promise.reject();
  };

  getPdfNotes = async (id: string): Promise<ResultGetPdfNotes> => {
    const res = await fetch(ORIGIN + `/api/notes/${encodeURIComponent(id)}`);
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
    const res = await fetch(ORIGIN + `/api/notes/${id}`, {
      ...this.getPutOptions(),
      body: JSON.stringify(pdfNotes),
    });
    if (!res.ok) return Promise.reject();
  };

  getPageImageUrl = (id: string, page: number, width: number, height: number) =>
    ORIGIN + `/api/images/${id}/${page}?width=${width}&height=${height}`;

  getAppSettings = async (): Promise<AppSettings> => {
    const res = await fetch(ORIGIN + "/api/settings");
    if (!res.ok) return Promise.reject();
    const appSettings = ((await res.json()) ??
      GetAppSettings_default()) as AppSettings;
    return appSettings;
  };
  putAppSettings = async (appSettings: AppSettings): Promise<void> => {
    const res = await fetch(ORIGIN + "/api/settings", {
      ...this.getPutOptions(),
      body: JSON.stringify(appSettings, null, 2),
    });
    if (!res.ok) return Promise.reject();
  };
}
