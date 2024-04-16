export type History = {
  id: string;
  name: string;
  origin: HistoryFileOrigin;
  accsessDate: string;
}[];

export enum HistoryFileOrigin {
  insideTree = 0,
  outsideTree = 1,
  web = 2,
}

export const HistoryFileOrigin2String = (origin: HistoryFileOrigin) => {
  switch (origin) {
    case HistoryFileOrigin.insideTree:
      return "ツリー内";
    case HistoryFileOrigin.outsideTree:
      return "ツリー外";
    case HistoryFileOrigin.web:
      return "ウェブ";
  }
};
