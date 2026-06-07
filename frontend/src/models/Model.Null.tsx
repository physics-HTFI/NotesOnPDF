import { GetCoverages_empty } from "@/types/Coverages";
import type IModel from "./IModel";
import { GetAppSettings_default } from "@/types/AppSettings";

export default class ModelNull implements IModel {
  getFileHandleFromPath = () => undefined;

  getCoverages = () => Promise.resolve(GetCoverages_empty());
  putCoverages = () => Promise.resolve();

  getPdfNotes = () => Promise.reject();
  putPdfNotes = () => Promise.resolve();

  getPageImageUrl = () => "";

  getAppSettings = () => Promise.resolve(GetAppSettings_default());
  putAppSettings = () => Promise.resolve();
}
