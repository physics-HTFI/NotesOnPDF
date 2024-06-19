import FileTree from "@/types/FileTree";
import Coverages from "@/types/Coverages";
import IModel, { ResultGetPdfNotes } from "./IModel";
import { GetAppSettings_default } from "@/types/AppSettings";
import History, { updateHistory } from "@/types/History";
import { VERSION } from "@/types/PdfNotes";

const pdfPaths = [
  "/NotesOnPDF/PDFs/Wikipedia.pdf",
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
      allPages: 73,
      enabledPages: 67,
      notedPages: 3,
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
  name: "Wikipedia.pdf",
  pdfNotes: {
    title: "Wikipedia",
    version: VERSION,
    currentPage: 0,
    settings: { fontSize: 100, offsetTop: 0, offsetBottom: 0 },
    pages: [
      {
        num: 1,
        part: "注釈一覧",
        notes: [
          {
            type: "Memo",
            x: 0.02,
            y: 0.02,
            html: '<span style="color: midnightblue; text-decoration: underline; font-size: 200%">注釈一覧</span>',
            style: "normal",
          },
          {
            type: "Chip",
            x: 0.02,
            y: 0.12,
            text: "マーカー",
            style: "filled",
          },
          {
            type: "Marker",
            x1: 0.17,
            y1: 0.13,
            x2: 0.64,
            y2: 0.13,
          },
          {
            type: "Chip",
            x: 0.02,
            y: 0.25,
            text: "矢印",
            style: "filled",
          },
          {
            type: "Arrow",
            x1: 0.15,
            y1: 0.21,
            x2: 0.23,
            y2: 0.31,
            style: "normal",
          },
          {
            type: "Arrow",
            x1: 0.23,
            y1: 0.21,
            x2: 0.31,
            y2: 0.31,
            style: "inverted",
          },
          {
            type: "Arrow",
            x1: 0.31,
            y1: 0.21,
            x2: 0.39,
            y2: 0.31,
            style: "both",
          },
          {
            type: "Arrow",
            x1: 0.39,
            y1: 0.21,
            x2: 0.47,
            y2: 0.31,
            style: "single",
          },
          {
            type: "Arrow",
            x1: 0.47,
            y1: 0.21,
            x2: 0.55,
            y2: 0.31,
            style: "double",
          },
          {
            type: "Chip",
            x: 0.02,
            y: 0.39,
            text: "長方形",
            style: "filled",
          },
          {
            type: "Rect",
            x: 0.16,
            y: 0.38,
            width: 0.1,
            height: 0.05,
            style: "filled",
          },
          {
            type: "Rect",
            x: 0.31,
            y: 0.38,
            width: 0.1,
            height: 0.05,
            style: "outlined",
          },
          {
            type: "Rect",
            x: 0.46,
            y: 0.38,
            width: 0.1,
            height: 0.05,
            style: "colorize",
          },
          {
            type: "Chip",
            x: 0.02,
            y: 0.51,
            text: "多角形",
            style: "filled",
          },
          {
            type: "Polygon",
            points: [
              [0.26, 0.53],
              [0.23, 0.56],
              [0.18, 0.56],
              [0.16, 0.51],
              [0.21, 0.49],
            ],
            style: "filled",
          },
          {
            type: "Polygon",
            points: [
              [0.41, 0.53],
              [0.38, 0.56],
              [0.33, 0.56],
              [0.31, 0.51],
              [0.36, 0.49],
            ],
            style: "outlined",
          },
          {
            type: "Polygon",
            points: [
              [0.56, 0.53],
              [0.53, 0.56],
              [0.48, 0.56],
              [0.46, 0.51],
              [0.51, 0.49],
            ],
            style: "colorize",
          },
          {
            type: "Chip",
            x: 0.02,
            y: 0.63,
            text: "チップ",
            style: "filled",
          },
          {
            type: "Chip",
            x: 0.14,
            y: 0.63,
            text: "チップ",
            style: "outlined",
          },
          {
            type: "Chip",
            x: 0.02,
            y: 0.71,
            text: "ページリンク",
            style: "filled",
          },
          {
            type: "PageLink",
            x: 0.19,
            y: 0.71,
            page: 4,
          },
          {
            type: "Chip",
            x: 0.02,
            y: 0.81,
            text: "メモ",
            style: "filled",
          },
          {
            type: "Memo",
            x: 0.14,
            y: 0.81,
            html: "インライン数式：$\\boldsymbol{F}=m\\ddot{\\boldsymbol{x}}$\n\n別行立て数式👇\n$$f(a)=\\frac{1}{2\\pi i}\\oint_\\gamma\\dfrac{f(z)}{z-a}dz$$",
            style: "normal",
          },
          {
            type: "Memo",
            x: 0.51,
            y: 0.81,
            html: "折り畳み (マウスホバーで中身を表示)\n\nガウス積分\n$$\\int_{-\\infty}^\\infty e^{-x^2}dx=\\sqrt{\\pi}$$",
            style: "fold",
          },
          {
            type: "Chip",
            x: 0.69,
            y: 0.2,
            text: "括弧",
            style: "filled",
          },
          {
            type: "Bracket",
            x1: 0.69,
            y1: 0.25,
            x2: 0.69,
            y2: 0.31,
            style: "start",
          },
          {
            type: "Bracket",
            x1: 0.69,
            y1: 0.33,
            x2: 0.69,
            y2: 0.39,
            style: "middle",
          },
          {
            type: "Bracket",
            x1: 0.69,
            y1: 0.41,
            x2: 0.69,
            y2: 0.47,
            style: "end",
          },
          {
            type: "Bracket",
            x1: 0.76,
            y1: 0.25,
            x2: 0.76,
            y2: 0.37,
            style: "normal",
          },
          {
            type: "Bracket",
            x1: 0.93,
            y1: 0.37,
            x2: 0.93,
            y2: 0.25,
            style: "normal",
          },
          {
            type: "Bracket",
            x1: 0.93,
            y1: 0.39,
            x2: 0.76,
            y2: 0.39,
            style: "normal",
          },
          {
            type: "Bracket",
            x1: 0.76,
            y1: 0.47,
            x2: 0.93,
            y2: 0.47,
            style: "normal",
          },
        ],
      },
      {
        num: 2,
        chapter: "1",
        part: "第1部 123",
        volume: "Wikipedia より",
        notes: [
          {
            type: "Rect",
            x: 0.09878393567580293,
            y: 0.6580921757770632,
            width: 0.23649434326442223,
            height: 0.030010718113612004,
            style: "filled",
          },
          {
            type: "Arrow",
            x1: 0.3390702421260366,
            y1: 0.6756966773847803,
            x2: 0.9734087103364131,
            y2: 0.7868156484458734,
            style: "normal",
          },
          {
            type: "Rect",
            x: 0.8573021157086208,
            y: 0.1591436227224009,
            width: 0.03539835202066832,
            height: 0.02702893890675241,
            style: "filled",
          },
          {
            type: "PageLink",
            x: 0.972877390597715,
            y: 0.07505359056806005,
            page: 17,
          },
          {
            type: "Arrow",
            x1: 0.882788929163502,
            y1: 0.15213612004287247,
            x2: 0.9611076107800367,
            y2: 0.11309431939978565,
            style: "normal",
          },
          {
            type: "Bracket",
            x1: 0.02898067842498214,
            y1: 0.40140300107181137,
            x2: 0.02898067842498214,
            y2: 0.7697974276527331,
            style: "normal",
          },
          {
            type: "Chip",
            x: -0.10553305925355747,
            y: 0.4154180064308681,
            text: "数学的性質",
            style: "filled",
          },
          {
            type: "Memo",
            x: 0.36738892374257126,
            y: 0.03104930332261525,
            html: "Wikipediaより引用\nhttps://ja.wikipedia.org/wiki/1",
            style: "normal",
          },
          {
            type: "Marker",
            x1: 0.4955729320133466,
            y1: 0.17041800643086816,
            x2: 0.725703151860948,
            y2: 0.17041800643086816,
          },
          {
            type: "Marker",
            x1: 0.055883425960690056,
            y1: 0.439443729903537,
            x2: 0.39570760535910593,
            y2: 0.439443729903537,
          },
        ],
      },
      {
        num: 3,
        notes: [
          {
            type: "Polygon",
            points: [
              [0.05021968963738314, 0.38438478027867096],
              [0.06296309636482374, 0.33733440514469454],
              [0.27535320848883366, 0.34033762057877814],
              [0.2753532084888336, 0.31931511254019296],
              [0.6293367286955168, 0.3203161843515541],
              [0.6265048605338633, 0.33733440514469454],
              [0.9323466219924377, 0.33833547695605576],
              [0.9380103583157446, 0.36736655948553054],
              [0.5259735407951653, 0.36236120042872455],
              [0.5217257385526851, 0.38438478027867096],
            ],
            style: "filled",
          },
          {
            type: "Rect",
            x: 0.10119331654714554,
            y: 0.9069442658092175,
            width: 0.4516829717837278,
            height: 0.02502679528403001,
            style: "filled",
          },
          {
            type: "Arrow",
            x1: -0.08795200308006518,
            y1: 0.8450735597463646,
            x2: 0.0870339757388782,
            y2: 0.9109485530546624,
            style: "normal",
          },
        ],
      },
      { num: 4 },
      { num: 5 },
      { num: 6 },
      { num: 7 },
      { num: 8 },
      { num: 9 },
      { num: 10 },
      { num: 11 },
      { num: 12, style: ["break-before", "excluded"] },
      { num: 13, style: ["excluded"] },
      { num: 14, style: ["excluded"] },
      { num: 15, style: ["excluded"] },
      { num: 16, style: ["excluded"] },
      { num: 17, style: ["excluded"] },
      { num: 18, chapter: "2" },
      { num: 19 },
      { num: 20 },
      { num: 21 },
      { num: 22, style: ["break-middle"] },
      { num: 23 },
      { num: 24 },
      { num: 25 },
      { num: 26 },
      { num: 27, chapter: "3" },
      { num: 28 },
      { num: 29 },
      { num: 30 },
      { num: 31 },
      { num: 32 },
      { num: 33 },
      { num: 34 },
      { num: 35 },
      { num: 36 },
      { num: 37 },
      { num: 38 },
      { num: 39 },
      { num: 40 },
      { num: 41, style: ["break-before"] },
      { num: 42 },
      { num: 43 },
      { num: 44 },
      { num: 45 },
      { num: 46 },
      { num: 47, chapter: "A", part: "第2部 ABC" },
      { num: 48 },
      { num: 49 },
      { num: 50 },
      { num: 51 },
      { num: 52, style: ["break-before"] },
      { num: 53 },
      { num: 54 },
      { num: 55, chapter: "B" },
      { num: 56 },
      { num: 57 },
      { num: 58 },
      { num: 59 },
      { num: 60, style: ["break-before"] },
      { num: 61 },
      { num: 62 },
      { num: 63, chapter: "C" },
      { num: 64 },
      { num: 65 },
      { num: 66 },
      { num: 67 },
      { num: 68 },
      { num: 69 },
      { num: 70, style: ["break-before"] },
      { num: 71 },
      { num: 72 },
      { num: 73 },
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
    isWeb: true,
  });
  getEventSource = () => undefined;

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
  putCoverages = () => Promise.resolve();

  getPdfNotes = (id: string): Promise<ResultGetPdfNotes> => {
    if (id !== pdfPaths[0]) return Promise.reject();
    return Promise.resolve(resultGetPdfNotes);
  };
  putPdfNotes = () => Promise.resolve();

  getPageImageUrl = () => "";

  getAppSettings = () => Promise.resolve(GetAppSettings_default());
  putAppSettings = () => Promise.resolve();
}
