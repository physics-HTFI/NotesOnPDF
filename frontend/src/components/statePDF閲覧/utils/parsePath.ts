/**
 * PDF パスから JSON パスを取得する
 */
export function parsePath(path: string) {
  const match = path.match(/([^/]+)\.[^.]*$/);
  const [name, jsonPath] = [match?.[1], `${path}.json`];
  if (!name) return undefined;
  return { name, jsonPath };
}
