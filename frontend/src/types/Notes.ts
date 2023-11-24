/**
 * 1つのPDFファイルに追加された全ての情報
 */
export interface Notes {
  numPages: number;
  currentPage: number;
  pages: Record<number, Page>;
  settings: Settings;
}

/**
 * 1つのページに追加された全ての情報
 */
export interface Page {
  book?: string;
  part?: string;
  chapter?: string;
  sectionBreak?: SectionBreak;
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
 * `Note`がまだ生成されていないPDFファイル用の初期インスタンスを返す
 */
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

/**
 * @returns `notes.currentPage`または`pageNumber`の表示上のページ数
 */
export const getPageLabel = (notes: Notes, pageNumber?: number): string => {
  pageNumber ??= notes.currentPage;
  let retval = 0;
  for (let i = pageNumber; 0 <= i; i--) {
    const restart = notes.pages[i]?.pageNumberRestart;
    if (restart === undefined) {
      ++retval;
    } else {
      retval += restart;
      break;
    }
  }
  return `p. ${retval}`;
};

/**
 * 節区切りのタイプ
 */
export type SectionBreak = "top" | "middle" | "top-middle" | undefined;

/**
 * @returns 節区切りを返す
 */
export const getSectionBreak = (
  top: boolean,
  middle: boolean
): SectionBreak => {
  if (top) {
    return middle ? "top-middle" : "top";
  } else if (middle) return "middle";
  return undefined;
};
