import { GetCoverages_empty } from "@/types/Coverages";
import IModel from "./IModel";
import { GetAppSettings_default } from "@/types/AppSettings";

export const sampleId2Path = (id?: string) => (id === "12" ? "文書1.pdf" : "");

export default class ModelNull implements IModel {
  getFlags = () => ({
    canToggleReadOnly: true,
    canOpenHistory: true,
    canOpenFileDialog: true,
    canOpenGithub: true,
    usePdfjs: false,
  });
  getMessage = () => undefined;

  getFileTree = () => Promise.resolve([]);
  getHistory = () => Promise.resolve([]);
  getIdFromExternalFile = () => Promise.reject();
  getIdFromUrl = () => Promise.reject();
  getFileFromId = () => Promise.reject();

  getCoverages = () => Promise.resolve(GetCoverages_empty());
  putCoverages = () => Promise.resolve();

  getPdfNotes = () => Promise.reject();
  putPdfNotes = () => Promise.reject();

  getPageImageUrl = () => "";

  getAppSettings = () => Promise.resolve(GetAppSettings_default());
  putAppSettings = () => Promise.reject();
}
