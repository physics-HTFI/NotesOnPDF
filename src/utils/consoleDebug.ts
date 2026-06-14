/**
 * `console.log()` と同等のもの。
 * ビルド時には実行されない。
 */
export function consoleDev(msg: unknown) {
  if (!import.meta.env.DEV) return; // https://ja.vite.dev/guide/env-and-mode
  console.log(msg);
}
