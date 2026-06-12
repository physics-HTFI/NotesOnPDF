/**
 * 画面上に表示する PDF 画像のサイズと位置
 */
export interface PageRect {
  rect?: DOMRect;
  top?: number;
  bottom?: number;
}

/**
 * ビューアーのサイズから `Rect` を返す関数の型
 */
export type Resizer = (size: {
  width: number;
  height: number;
}) => PageRect | undefined;
