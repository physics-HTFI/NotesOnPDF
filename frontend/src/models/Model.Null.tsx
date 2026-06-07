import type IModel from "./IModel";

export default class ModelNull implements IModel {
  getFileHandleFromPath = () => undefined;

  getPdfNotes = () => Promise.reject();
  putPdfNotes = () => Promise.resolve();
}
