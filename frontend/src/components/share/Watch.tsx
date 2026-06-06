import { useState } from "react";

/**
 * `target` が変更されたときに、`onChange`（＝ `useOnChange` の戻り値）を実行する
 */
export function Watch<T>({
  target,
  useOnChange,
}: {
  target: T;
  useOnChange: (() => (t: T) => void)[];
}) {
  const [currentTarget, setCurrentTarget] = useState<T>();
  const onChange = useOnChange.map((use) => use());

  if (currentTarget !== target) {
    setTimeout(() => {
      setCurrentTarget(target);
      for (const handle of onChange) {
        handle(target);
      }
    }, 0);
  }
  return <></>;
}

// setTimeout せずに直接 setState すると以下のエラーが出る：
// Cannot update a component (A) while rendering a different component (B)
// そのため、atom が変化したときのリレンダー中に setState/setAtom するのは避けるべき。
// useEffect を使うという手もあるが、カスタムフック由来の関数があると、その関数については
// useCallback 化しておくする必要があるのと、更新タイミングが読みづらくなるので避ける。
