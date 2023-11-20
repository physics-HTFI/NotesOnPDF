/**
 * 1つのページに追加された全ての情報
 */
export interface Page {
  book?: string;
  part?: string;
  chapter?: string;
  sectionStart: boolean;
  sectionStartMiddle: boolean;
  disabled: boolean;
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
export interface PDF {
  currentPage: number;
  settings: Settings;
  pages: Page[];
}
