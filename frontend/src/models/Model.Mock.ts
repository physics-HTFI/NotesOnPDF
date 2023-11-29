import { FileTree } from "@/types/FileTree";
import { Notes } from "@/types/Notes";
import { Progresses } from "@/types/Progresses";
import IModel from "./IModel";

export default class ModelMock implements IModel {
  private wait = () => new Promise((resolve) => setTimeout(resolve, 300));

  public getFileTree = async (): Promise<FileTree> => {
    await this.wait();
    return [
      "文書1.pdf",
      [
        "dummy1/",
        [
          [
            "dummy11/",
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

  getNotes = async (): Promise<Notes> => {
    await this.wait();
    return {
      numPages: 29,
      currentPage: 0,
      settings: {
        offsetTop: 0,
        offsetBottom: 0,
        offsetLeft: 0,
        offsetRight: 0,
      },
      pages: {
        "0": { book: "タイトル", excluded: true },
        "1": { excluded: true },
        "2": { excluded: true },
        "3": { part: "第1部" },
        "4": { chapter: "第1章" },
        "7": { sectionBreak: true },
        "10": { chapter: "第2章" },
        "11": { sectionBreak: true },
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
