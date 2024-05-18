import FileTree from "@/types/FileTree";
import Coverages, { GetCoverages_empty } from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import AppSettings, { GetAppSettings_default } from "@/types/AppSettings";
import History from "@/types/History";

export default class ModelWeb implements IModel {
  constructor(private handle: FileSystemDirectoryHandle) {
    alert(this.handle.name);
  }

  getFlags = () => ({
    canToggleReadOnly: true,
    canOpenHistory: true,
    canOpenFileDialog: false,
    canOpenGithub: true,
    usePdfjs: true,
  });
  getMessage = (reason: string) => <>{`${reason}に失敗しました`}</>;

  private wait = () => new Promise((resolve) => setTimeout(resolve, 0));

  public getFileTree = async (): Promise<FileTree> => {
    await this.wait();
    return [];
  };
  getHistory = async (): Promise<History> => {
    await this.wait();
    return [];
  };
  getIdFromExternalFile = () => Promise.reject();
  getIdFromUrl = () => Promise.reject();
  getFileFromId = (id: string) => {
    console.log(id);
    return Promise.reject();
  };

  public getCoverages = async (): Promise<Coverages> => {
    await this.wait();
    return GetCoverages_empty();
  };
  putCoverages = async (): Promise<void> => {
    await this.wait();
  };

  getPdfNotes = async (): Promise<ResultGetPdfNotes> => {
    await this.wait();
    throw new Error();
  };
  putPdfNotes = async (): Promise<void> => {
    await this.wait();
  };

  getPageImageUrl = () => "";

  getAppSettings = async (): Promise<AppSettings> => {
    await this.wait();
    return GetAppSettings_default();
  };
  putAppSettings = async (): Promise<void> => {
    await this.wait();
  };
}
