import { GetCoverages_empty } from "@/types/Coverages";
import IModel from "./IModel";
import { GetAppSettings_default } from "@/types/AppSettings";

export default class ModelNull implements IModel {
  getFlags = () => ({
    canToggleReadOnly: true,
    canOpenHistory: true,
    canOpenFileDialog: true,
    canOpenGithub: true,
    usePdfjs: true,
  });
  getMessage = () => undefined;

  getFileTree = () => Promise.resolve([]);
  getHistory = () => Promise.resolve([]);
  updateHistory = () => Promise.reject();
  clearHistory = () => Promise.resolve();
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
