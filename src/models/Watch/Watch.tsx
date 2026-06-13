import { useState } from "react";

/**
 * `target` が変更されたときに `onChange` を実行するコンポーネント
 */
export function Watch<T>({
  target,
  onChange,
}: {
  target: T;
  onChange: (newValue: T) => void;
}) {
  const [currentTarget, setCurrentTarget] = useState<T>();

  if (currentTarget !== target) {
    setTimeout(() => {
      setCurrentTarget(target);
      onChange(target);
    }, 0);
  }
  return <></>;
}

// setTimeout せずに直接 setState すると以下のエラーが出る：
// Cannot update a component (A) while rendering a different component (B)
// そのため、atom が変化したときのリレンダー中に setState/setAtom するのは避けるべき。
// useEffect を使うという手もあるが、カスタムフック由来の関数があると、その関数については
// useCallback 化しておくする必要があるのと、更新タイミングが読みづらくなるので避ける。
