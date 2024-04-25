import { FC, ReactNode, createContext, useState } from "react";
import Waiting from "@/components/Fullscreen/Waiting";

interface WaitContextType {
  setWaiting: (waiting: boolean) => void;
}

/**
 * 待機インジケーターのコンテクスト
 */
export const WaitContext = createContext<WaitContextType>({
  setWaiting: () => undefined,
});

/**
 * `WaitContextProvider`の引数
 */
interface Props {
  children: ReactNode;
}

/**
 * `WaitContext`のプロバイダー
 */
export const WaitContextProvider: FC<Props> = ({ children }) => {
  const [waiting, setWaiting] = useState(false);

  return (
    <WaitContext.Provider value={{ setWaiting }}>
      {children}
      <Waiting isWaiting={waiting} />
    </WaitContext.Provider>
  );
};
