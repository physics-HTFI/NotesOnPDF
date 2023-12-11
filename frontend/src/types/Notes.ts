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
  /** 本のタイトル */
  book?: string;
  /** 部のタイトル */
  part?: string;
  /** 章のタイトル */
  chapter?: string;
  /** このページで節が変わる場合`true` */
  sectionBreak?: boolean;
  /** 新たにページ番号を振りなおす場合に数値を指定する */
  pageNumberRestart?: number;
  /** 無効なページの場合に`true` */
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
  /** PDFの上側がどれだけ見切れるか */
  offsetTop: number;
  /** PDFの下側がどれだけ見切れるか */
  offsetBottom: number;
}

/**
 * `Note`がまだ生成されていないPDFファイル用の初期インスタンスを返す
 */
export const createNewNotes = (title: string, numPages: number): Notes => ({
  numPages,
  currentPage: 0,
  settings: { offsetTop: 10, offsetBottom: 10 },
  pages: {
    0: {
      book: title.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? undefined,
      pageNumberRestart: 1,
    },
  },
});

/**
 * `pageNumber`の表示上のページ数を返す。
 * `pageNumber`が省略されている場合は`notes.currentPage`を対象とする。
 */
export const getPageLabelSmall = (
  notes: Notes,
  pageNumber?: number
): string => {
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
