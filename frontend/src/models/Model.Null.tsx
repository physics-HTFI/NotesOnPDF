import { GetCoverages_empty } from "@/types/Coverages";
import IModel from "./IModel";
import { GetAppSettings_default } from "@/types/AppSettings";

export default class ModelNull implements IModel {
  getFlags = () => ({
    isMock: false,
    canOpenFileDialog: true,
    canOpenGithub: true,
  });
  getEventSource = () => undefined;

  getFileTree = () => Promise.resolve([]);
  getHistory = () => Promise.resolve([]);
  updateHistory = () => Promise.resolve();
  deleteHistoryAll = () => Promise.resolve();
  deleteHistory = () => Promise.resolve();
  getIdFromExternalFile = () => Promise.reject();
  getIdFromUrl = () => Promise.reject();
  getFileFromId = () => Promise.reject();

  getCoverages = () => Promise.resolve(GetCoverages_empty());
  putCoverages = () => Promise.resolve();

  getPdfNotes = () => Promise.reject();
  putPdfNotes = () => Promise.resolve();

  getPageImageUrl = () => "";

  getAppSettings = () => Promise.resolve(GetAppSettings_default());
  putAppSettings = () => Promise.resolve();
}
