import FileTree from "@/types/FileTree";
import Coverages from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import { GetAppSettings_default } from "@/types/AppSettings";
import History, { updateHistory } from "@/types/History";

const pdfPaths = [
  "/PDFs/文書1.pdf",
  "dummy1/",
  "dummy1/dummy11/",
  "dummy1/dummy11/11A.pdf",
  "dummy1/dummy11/11B.pdf",
  "dummy1/dummy11/11C.pdf",
  "dummy1/dummy1A.pdf",
  "dummy1/dummy1B.pdf",
  "dummy1/dummy1C.pdf",
  "dummy2/dummy2/",
  "dummy2/dummy2A.pdf",
  "dummy2/dummy2B.pdf",
] as const;
const fileTree: FileTree = [
  { path: "", id: "0", children: [pdfPaths[1], pdfPaths[9], pdfPaths[0]] },
  {
    path: pdfPaths[1],
    id: pdfPaths[1],
    children: [pdfPaths[2], pdfPaths[6], pdfPaths[7], pdfPaths[8]],
  },
  {
    path: pdfPaths[2],
    id: pdfPaths[2],
    children: [pdfPaths[3], pdfPaths[4], pdfPaths[5]],
  },
  { path: pdfPaths[3], id: pdfPaths[3], children: null },
  { path: pdfPaths[4], id: pdfPaths[4], children: null },
  { path: pdfPaths[5], id: pdfPaths[5], children: null },
  { path: pdfPaths[6], id: pdfPaths[6], children: null },
  { path: pdfPaths[7], id: pdfPaths[7], children: null },
  { path: pdfPaths[8], id: pdfPaths[8], children: null },
  {
    path: pdfPaths[9],
    id: pdfPaths[9],
    children: [pdfPaths[10], pdfPaths[11]],
  },
  { path: pdfPaths[10], id: pdfPaths[10], children: null },
  { path: pdfPaths[11], id: pdfPaths[11], children: null },
  { path: pdfPaths[0], id: pdfPaths[0], children: null },
];

const coverages: Coverages = {
  recentId: pdfPaths[0],
  pdfs: {
    [pdfPaths[0]]: {
      allPages: 29,
      enabledPages: 23,
      notedPages: 1,
      percent: 4,
    },
    [pdfPaths[6]]: {
      allPages: 100,
      enabledPages: 100,
      notedPages: 20,
      percent: 20,
    },
    [pdfPaths[7]]: {
      allPages: 100,
      enabledPages: 100,
      notedPages: 50,
      percent: 50,
    },
    [pdfPaths[8]]: {
      allPages: 100,
      enabledPages: 100,
      notedPages: 100,
      percent: 100,
    },
  },
};
const resultGetPdfNotes: ResultGetPdfNotes = {
  name: "文書1.pdf",
  pdfNotes: {
    title: "文書1",
    version: "1.0",
    currentPage: 0,
    settings: {
      fontSize: 70,
      offsetTop: 0.05,
      offsetBottom: 0.05,
    },
    pages: [
      {
        num: 1,

        volume: "タイトル",
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
          {
            type: "Chip",
            x: 0.1,
            y: 0.25,
            text: "チップ",
            style: "filled",
          },
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
            type: "Memo",
            x: 0.1,
            y: 0.45,
            html: "インライン数式：$\\ddot{\\boldsymbol{x}}=100$\n別行立て数式👇\n$$\\int e^x dx$$",
          },
          {
            type: "Memo",
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
  },
};

export default class ModelMock implements IModel {
  private history: History = [];

  getFlags = () => ({
    canToggleReadOnly: false,
    canOpenHistory: false,
    canOpenFileDialog: false,
    canOpenGithub: true,
    usePdfjs: true,
  });
  getMessage = (reason: string) => <>{`${reason}に失敗しました`}</>;

  getFileTree = () => Promise.resolve(fileTree);

  getHistory = () => Promise.resolve(this.history);
  updateHistory = (id: string, pages: number) => {
    this.history = updateHistory(this.history, id, pages);
    return Promise.resolve();
  };
  deleteHistoryAll = () => {
    this.history = [];
    return Promise.resolve();
  };
  deleteHistory = (id: string) => {
    this.history = this.history.filter((h) => h.id !== id);
    return Promise.resolve();
  };

  getIdFromExternalFile = () => Promise.reject();
  getIdFromUrl = () => Promise.reject();
  getFileFromId = (id: string) => {
    if (id !== pdfPaths[0]) return Promise.reject();
    return Promise.resolve(pdfPaths[0]);
  };

  getCoverages = () => Promise.resolve(coverages);
  putCoverages = () => Promise.reject();

  getPdfNotes = (id: string): Promise<ResultGetPdfNotes> => {
    if (id !== pdfPaths[0]) return Promise.reject();
    return Promise.resolve(resultGetPdfNotes);
  };
  putPdfNotes = () => Promise.reject();

  getPageImageUrl = () => "";

  getAppSettings = () => Promise.resolve(GetAppSettings_default());
  putAppSettings = () => Promise.reject();
}
