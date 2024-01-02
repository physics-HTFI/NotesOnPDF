import { FC, ReactNode } from "react";

/**
 * `Svg`の引数
 */
interface Props {
  pageRect: DOMRect;
  children: ReactNode;
  noPointerEvents?: boolean;
}

/**
 * <svg>要素
 */
const Svg: FC<Props> = ({ pageRect, children, noPointerEvents }) => (
  <svg
    viewBox={`0 0 ${pageRect.width} ${pageRect.height}`}
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      overflow: "visible",
      pointerEvents: noPointerEvents ? "none" : undefined,
    }}
  >
    {children}
  </svg>
);

export default Svg;
