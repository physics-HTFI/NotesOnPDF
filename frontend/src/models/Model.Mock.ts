import { FileTree } from "@/types/FileTree";
import { PdfInfo } from "@/types/PdfInfo";
import { Progresses } from "@/types/Progresses";
import IModel from "./IModel";
import { AppSettings, AppSettings_default } from "@/types/AppSettings";

export default class ModelMock implements IModel {
  private wait = () => new Promise((resolve) => setTimeout(resolve, 300));

  public getFileTree = async (): Promise<FileTree> => {
    await this.wait();
    return [
      [
        "dummy1/",
        [
          [
            "dummy1/dummy11/",
            [
              "dummy1/dummy11/dummy11A.pdf",
              "dummy1/dummy11/dummy11B.pdf",
              "dummy1/dummy11/dummy11C.pdf",
            ],
          ],
          "dummy1/dummy1A.pdf",
          "dummy1/dummy1B.pdf",
          "dummy1/dummy1C.pdf",
        ],
      ],
      ["dummy2/", ["dummy2/dummy2A.pdf", "dummy1/dummy2B.pdf"]],
      "文書1.pdf",
    ];
    /*
    return [
      [
        "dir1/",
        [
          [
            "dir1/dir2/",
            ["dir1/dir2/file121", "dir1/dir2/file122", "dir1/dir2/file123"],
          ],
          "dir1/file11",
          "dir1/file12",
        ],
      ],
      "file1",
      "file2",
    ];
    */
  };

  public getProgresses = async (): Promise<Progresses> => {
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
    /*
    return {
      recentPath: "dir1/file12",
      PDFs: {
        "dir1/dir2/file121": {
          allPages: 110,
          enabledPages: 100,
          notedPages: 100,
        },
        "dir1/dir2/file122": {
          allPages: 110,
          enabledPages: 100,
          notedPages: 99,
        },
        "dir1/dir2/file123": {
          allPages: 110,
          enabledPages: 100,
          notedPages: 80,
        },
        "dir1/file11": {
          allPages: 110,
          enabledPages: 100,
          notedPages: 50,
        },
        "dir1/file12": {
          allPages: 110,
          enabledPages: 100,
          notedPages: 10,
        },
        file1: {
          allPages: 100,
          enabledPages: 100,
          notedPages: 1,
        },
      },
    };
    */
  };

  getPdfInfo = async (path: string): Promise<PdfInfo> => {
    await this.wait();
    if (path !== "文書1.pdf") throw new Error();
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
        { num: 2, style: ["excluded"] },
        { num: 3, style: ["excluded"] },
        { num: 4, part: "第1部" },
        { num: 5, chapter: "第1章" },
        { num: 6 },
        { num: 7 },
        { num: 8, style: ["break-before"] },
        { num: 9 },
        { num: 10 },
        { num: 11, chapter: "第2章" },
        { num: 12, style: ["break-middle"] },
        { num: 13 },
        { num: 14 },
        { num: 15 },
        { num: 16 },
        { num: 17 },
        { num: 18, chapter: "第3章" },
        { num: 19, style: ["break-before"] },
        { num: 20 },
        { num: 21 },
        { num: 22 },
        { num: 23, part: "第2部", style: ["excluded"] },
        { num: 24, chapter: "第4章" },
        { num: 25 },
        { num: 26, chapter: "第5章" },
        { num: 27 },
        { num: 28, chapter: "", style: ["excluded"] },
        { num: 29, style: ["excluded"] },
      ],
    };
  };

  getAppSettings = async (): Promise<AppSettings> => {
    await this.wait();
    return { ...AppSettings_default };
  };
}
