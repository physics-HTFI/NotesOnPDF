import { FileTree } from "@/types/FileTree";
import { PdfInfo } from "@/types/PdfInfo";
import { Coverages } from "@/types/Coverages";
import IModel from "./IModel";
import { AppSettings, GetAppSettings_default } from "@/types/AppSettings";

export const sampleId2Path = (id?: string) => (id === "12" ? "文書1.pdf" : "");

export default class ModelMock implements IModel {
  private wait = () => new Promise((resolve) => setTimeout(resolve, 300));

  public getFileTree = async (): Promise<FileTree> => {
    await this.wait();
    return [
      { path: "", id: "root", children: ["1", "9", "12"] },
      { path: "dummy1/", id: "1", children: ["2", "6", "7", "8"] },
      { path: "dummy1/dummy11/", id: "2", children: ["3", "4", "5"] },
      { path: "dummy1/dummy11/11A.pdf", id: "3", children: null },
      { path: "dummy1/dummy11/11B.pdf", id: "4", children: null },
      { path: "dummy1/dummy11/11C.pdf", id: "5", children: null },
      { path: "dummy1/dummy1A.pdf", id: "6", children: null },
      { path: "dummy1/dummy1B.pdf", id: "7", children: null },
      { path: "dummy1/dummy1C.pdf", id: "8", children: null },
      { path: "dummy2/dummy2/", id: "9", children: ["10", "11"] },
      { path: "dummy2/dummy2A.pdf", id: "10", children: null },
      { path: "dummy2/dummy2B.pdf", id: "11", children: null },
      { path: "文書1.pdf", id: "12", children: null },
    ];
  };

  public getCoverages = async (): Promise<Coverages> => {
    await this.wait();
    return {
      recentPath: "文書1.pdf",
      PDFs: {
        "文書1.pdf": {
          allPages: 29,
          enabledPages: 23,
          notedPages: 0,
        },
        "dummy1/dummy1A.pdf": {
          allPages: 100,
          enabledPages: 100,
          notedPages: 20,
        },
        "dummy1/dummy1B.pdf": {
          allPages: 100,
          enabledPages: 100,
          notedPages: 50,
        },
        "dummy1/dummy1C.pdf": {
          allPages: 100,
          enabledPages: 100,
          notedPages: 100,
        },
      },
    };
  };
  putCoverages = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };

  getPdfInfo = async (id: string): Promise<PdfInfo> => {
    await this.wait();
    if (id !== "12") throw new Error();
    return {
      currentPage: 0,
      settings: {
        fontSize: 70,
        offsetTop: 0.05,
        offsetBottom: 0.05,
      },
      pages: [
        {
          num: 1,
          sizeRatio: 0.705,
          book: "タイトル",
          notes: [
            {
              type: "Arrow",
              heads: ["end"],
              x1: 0.1,
              y1: 0.1,
              x2: 0.2,
              y2: 0.2,
            },
            {
              type: "Arrow",
              x1: 0.2,
              y1: 0.1,
              x2: 0.3,
              y2: 0.2,
              heads: ["start", "end"],
            },
            {
              type: "Arrow",
              x1: 0.3,
              y1: 0.1,
              x2: 0.4,
              y2: 0.2,
              heads: ["start"],
            },
            {
              type: "Arrow",
              x1: 0.4,
              y1: 0.1,
              x2: 0.5,
              y2: 0.2,
              heads: [],
            },
            {
              type: "Bracket",
              x1: 0.6,
              y1: 0.1,
              x2: 0.6,
              y2: 0.2,
              heads: ["start", "end"],
            },
            {
              type: "Bracket",
              x1: 0.65,
              y1: 0.1,
              x2: 0.65,
              y2: 0.2,
              heads: ["start"],
            },
            {
              type: "Bracket",
              x1: 0.7,
              y1: 0.1,
              x2: 0.7,
              y2: 0.2,
              heads: ["end"],
            },
            {
              type: "Bracket",
              x1: 0.75,
              y1: 0.1,
              x2: 0.75,
              y2: 0.2,
              heads: [],
            },
            {
              type: "Bracket",
              heads: ["end"],
              x1: 0.8,
              y1: 0.2,
              x2: 0.95,
              y2: 0.2,
            },
            { type: "Chip", x: 0.1, y: 0.25, text: "チップ", style: "filled" },
            {
              type: "Chip",
              x: 0.1,
              y: 0.29,
              text: "チップ",
              style: "outlined",
            },
            {
              type: "Chip",
              x: 0.1,
              y: 0.33,
              text: "絵文字❓❔✅",
              style: "outlined",
            },
            { type: "Marker", x1: 0.1, y1: 0.4, x2: 0.9, y2: 0.4 },
            {
              type: "Note",
              x: 0.1,
              y: 0.45,
              html: "インライン数式：$\\ddot{\\boldsymbol{x}}=100$\n別行立て数式👇\n$$\\int e^x dx$$",
            },
            {
              type: "Note",
              x: 0.5,
              y: 0.45,
              html: `<span style="text-decoration: underline;">下線</span> <strong>太字</strong> <span style="color: green;">green</span>\n<span>絵文字</span><span style="font-size: 150%">⚡🔥✨</span>\n<span style="font-family: serif; font-size: 200%">文字サイズ</span></br><span style="transform: rotate(15deg); display: inline-block;">回転</span>`,
            },
            { type: "PageLink", x: 0.1, y: 0.63, page: 10 },
            { type: "PageLink", x: 0.25, y: 0.63, page: 999 },
            {
              type: "Polygon",
              points: [
                [0.15, 0.68],
                [0.2, 0.7],
                [0.22, 0.75],
                [0.1, 0.75],
              ],
              style: "filled",
            },
            {
              type: "Polygon",
              points: [
                [0.35, 0.68],
                [0.4, 0.7],
                [0.42, 0.75],
                [0.3, 0.75],
              ],
              style: "outlined",
            },
            {
              type: "Rect",
              x: 0.1,
              y: 0.8,
              width: 0.2,
              height: 0.05,
              style: "filled",
            },
            {
              type: "Rect",
              x: 0.4,
              y: 0.77,
              width: 0.2,
              height: 0.08,
              style: "outlined",
            },
          ],
        },
        { num: 2, sizeRatio: 0.705, style: ["excluded"] },
        { num: 3, sizeRatio: 0.705, style: ["excluded"] },
        { num: 4, sizeRatio: 0.705, part: "第1部" },
        { num: 5, sizeRatio: 0.705, chapter: "第1章" },
        { num: 6, sizeRatio: 0.705 },
        { num: 7, sizeRatio: 0.705 },
        { num: 8, sizeRatio: 0.705, style: ["break-before"] },
        { num: 9, sizeRatio: 0.705 },
        { num: 10, sizeRatio: 0.705 },
        { num: 11, sizeRatio: 0.705, chapter: "第2章" },
        { num: 12, sizeRatio: 0.705, style: ["break-middle"] },
        { num: 13, sizeRatio: 0.705 },
        { num: 14, sizeRatio: 0.705 },
        { num: 15, sizeRatio: 0.705 },
        { num: 16, sizeRatio: 0.705 },
        { num: 17, sizeRatio: 0.705 },
        { num: 18, sizeRatio: 0.705, chapter: "第3章" },
        { num: 19, sizeRatio: 0.705, style: ["break-before"] },
        { num: 20, sizeRatio: 0.705 },
        { num: 21, sizeRatio: 0.705 },
        { num: 22, sizeRatio: 0.705 },
        { num: 23, sizeRatio: 0.705, part: "第2部", style: ["excluded"] },
        { num: 24, sizeRatio: 0.705, chapter: "第4章" },
        { num: 25, sizeRatio: 0.705 },
        { num: 26, sizeRatio: 0.705, chapter: "第5章" },
        { num: 27, sizeRatio: 0.705 },
        { num: 28, sizeRatio: 0.705, chapter: "", style: ["excluded"] },
        { num: 29, sizeRatio: 0.705, style: ["excluded"] },
      ],
    };
  };
  putPdfInfo = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };

  getPageImage = () => "";

  getAppSettings = async (): Promise<AppSettings> => {
    await this.wait();
    return GetAppSettings_default();
  };
  putAppSettings = async (): Promise<void> => {
    await this.wait();
    throw new Error();
  };
}
