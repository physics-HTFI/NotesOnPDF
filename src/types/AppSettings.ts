/**
 * 注釈の右／中クリック時の動作
 */
export type ClickOption = null | "edit" | "move" | "delete";

/**
 * 注釈の右／中クリック時の動作
 */
export type PaletteIconType =
  | "Arrow"
  | "Bracket"
  | "Chip"
  | "Marker"
  | "Memo"
  | "PageLink"
  | "Polygon"
  | "Rect";

/**
 * アプリ設定
 */
export default interface AppSettings {
  /** 空クリックでモードを解除する */
  cancelModeWithVoidClick: boolean;
  /** 注釈をスナップする */
  snapNotes: boolean;
  /** 注釈の右クリック時の動作 */
  rightClick: ClickOption;
  /** 注釈の中クリック時の動作 */
  middleClick: ClickOption;
  /** パレットのアイコン順序（右側から時計回り） */
  paletteIcons: PaletteIconType[];
}

/** デフォルトのアプリ設定 */
export const GetAppSettings_default: () => AppSettings = () => ({
  cancelModeWithVoidClick: true,
  snapNotes: true,
  rightClick: null,
  middleClick: null,
  paletteIcons: [
    "Marker",
    "Arrow",
    "Bracket",
    "Polygon",
    "Chip",
    "PageLink",
    "Memo",
    "Rect",
  ],
});
