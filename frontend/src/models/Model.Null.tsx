import type IModel from "./IModel";

export default class ModelNull implements IModel {
  getPdfNotes = () => Promise.reject();
  putPdfNotes = () => Promise.resolve();
}
