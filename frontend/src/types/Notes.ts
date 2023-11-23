/**
 * 1つのページに追加された全ての情報
 */
export interface Page {
  book?: string;
  part?: string;
  chapter?: string;
  sectionBreak?: "top" | "middle" | "top-middle";
  pageNumberRestart?: number;
  excluded?: boolean;
  // badge     texts  footnotes
  // polygons         markers
  // links     lines  rectangles
}

/**
 * 1つのPDFファイルの設定情報
 */
export interface Settings {
  colorPrimary?: string;
  colorSecondary?: string;
  fontSizeSmall?: number;
  fontSizeMiddle?: number;
  fontSizeLarge?: number;
  offsetTop: number;
  offsetBottom: number;
  offsetLeft: number;
  offsetRight: number;
}

/**
 * 1つのPDFファイルに追加された全ての情報
 */
export interface Notes {
  numPages: number;
  currentPage: number;
  settings: Settings;
  pages: Record<number, Page>;
}

export const createNewNotes = (title: string, numPages: number): Notes => ({
  numPages,
  currentPage: 0,
  settings: { offsetTop: 0, offsetBottom: 0, offsetLeft: 0, offsetRight: 0 },
  pages: {
    0: {
      book: title.match(/[^\\/]+$/)?.[0] ?? undefined,
      pageNumberRestart: 1,
    },
  },
});
