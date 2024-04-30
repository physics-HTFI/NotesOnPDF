export type History = {
  id: string;
  name: string;
  origin: HistoryFileOrigin;
  accessDate: string;
}[];

export enum HistoryFileOrigin {
  insideTree = 0,
  outsideTree = 1,
  web = 2,
}

export const historyFileOrigin2String = (origin: HistoryFileOrigin) => {
  switch (origin) {
    case HistoryFileOrigin.insideTree:
      return "ツリー";
    case HistoryFileOrigin.outsideTree:
      return "ツリー外";
    case HistoryFileOrigin.web:
      return "ウェブ";
  }
};
