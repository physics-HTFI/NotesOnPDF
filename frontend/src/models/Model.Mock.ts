import { FileTree } from "@/types/FileTree";
import { Notes } from "@/types/Notes";
import { Progresses } from "@/types/Progresses";
import IModel from "./IModel";

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

  getNotes = async (path: string): Promise<Notes> => {
    await this.wait();
    if (path !== "文書1.pdf") throw new Error();
    return {
      numPages: 29,
      currentPage: 0,
      settings: {
        offsetTop: 0.1,
        offsetBottom: 0.1,
      },
      pages: {
        "0": {
          book: "タイトル",
          notes: [
            { type: "Rect", x: 0.5, y: 0.5, width: 0.2, height: 0.1 },
            {
              type: "Polygon",
              points: [
                [0.3, 0.3],
                [0.35, 0.3],
                [0.35, 0.35],
                [0.25, 0.35],
              ],
            },
            { type: "Arrow", x1: 0.4, y1: 0.4, x2: 0.8, y2: 0.8 },
            { type: "Bracket", x1: 0.2, y1: 0.8, x2: 0.5, y2: 0.8 },
            { type: "Marker", x1: 0.2, y1: 0.6, x2: 0.8, y2: 0.6 },
            {
              type: "Note",
              x: 0.01,
              y: 0.12,
              html: `<h3>h3</h3>あいうえお<br/>かき $x$ くけこ $$\\int e^x dx$$ $10 / 3 \\approx 3.33$`,
            },
            { type: "PageLink", x: 0.1, y: 0.5, page: 10 },
            { type: "Chip", x: 0.1, y: 0.7, label: "定理" },
          ],
        },
        "1": { excluded: true },
        "2": { excluded: true },
        "3": { part: "第1部" },
        "4": { chapter: "第1章" },
        "7": { sectionBreak: true },
        "10": { chapter: "第2章" },
        "11": { sectionBreakInner: true },
        "17": { chapter: "第3章" },
        "18": { sectionBreak: true },
        "22": { part: "第2部", excluded: true },
        "23": { chapter: "第4章" },
        "25": { chapter: "第5章" },
        "27": { chapter: "", excluded: true },
        "28": { excluded: true },
      },
    };
  };
}
