import { CSSProperties, ReactNode } from "react";

/**
 * <svg>要素
 */
export default function Svg({
  pageRect,
  children,
  noPointerEvents,
  style,
}: {
  pageRect: DOMRect;
  children: ReactNode;
  noPointerEvents?: boolean;
  style?: CSSProperties;
}) {
  return (
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
        ...style,
      }}
    >
      {children}
    </svg>
  );
}
