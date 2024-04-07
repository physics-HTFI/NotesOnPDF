/**
 * 注釈の右／中クリック時の動作
 */
export type ClickOption = null | "edit" | "move" | "delete";

/**
 * アプリ設定
 */
export interface AppSettings {
  /** 空クリックでモードを解除する */
  cancelModeWithVoidClick: boolean;
  /** 注釈をスナップする */
  snapNotes: boolean;
  /** 注釈の右クリック時の動作 */
  rightClick: ClickOption;
  /** 注釈の中クリック時の動作 */
  middleClick: ClickOption;
}

/** デフォルトのアプリ設定 */
export const GetAppSettings_default: () => AppSettings = () => ({
  cancelModeWithVoidClick: true,
  snapNotes: true,
  rightClick: null,
  middleClick: null,
});
