import { FileTree } from "@/types/FileTree";
import { Notes } from "@/types/Notes";
import { Progresses } from "@/types/Progresses";
import IModel from "./IModel";

export default class ModelMock implements IModel {
  private wait = () => new Promise((resolve) => setTimeout(resolve, 300));

  public getFileTree = async (): Promise<FileTree> => {
    await this.wait();
    return ["文書1.pdf", ["フォルダ/", ["フォルダ/文書2.pdf"]]];
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
      PDFs: {},
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
      numPages: 15,
      currentPage: 3,
      settings: {
        offsetTop: 0,
        offsetBottom: 0,
        offsetLeft: 0,
        offsetRight: 0,
      },
      pages: {
        0: {
          book: "タイトル",
          part: "第1部",
        },
        1: {
          chapter: "第1章",
          pageNumberRestart: 10,
          excluded: true,
        },
        3: {
          sectionBreak: true,
        },
        6: {
          chapter: "第2章",
        },
        8: {
          sectionBreak: true,
        },
      },
    };
  };
}
