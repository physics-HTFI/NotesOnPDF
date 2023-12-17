import React from "react";
import { Page } from "@/types/Notes";
import Arrow from "./Overlay/Arrow";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Note from "./Overlay/Note";
import PageLink from "./Overlay/PageLink";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";
import Svg from "./Overlay/Svg";
import { MathJaxContext } from "better-react-mathjax";

const mathjaxConfig = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

/**
 * `Overlay`の引数
 */
interface Props {
  page?: Page;
  width?: number;
  height?: number;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Overlay: React.FC<Props> = ({ page, width, height }) => {
  if (!page || !width || !height) return <></>;
  return (
    <>
      <Svg width={width} height={height}>
        <Rect
          x={0.5 * width}
          y={0.5 * height}
          width={0.2 * width}
          height={0.1 * height}
          onClick={() => undefined}
        />
        <Polygon
          points={[
            [0.3 * width, 0.3 * height],
            [0.35 * width, 0.3 * height],
            [0.35 * width, 0.35 * height],
            [0.25 * width, 0.35 * height],
          ]}
          onClick={() => undefined}
        />

        <Arrow
          x1={0.4 * width}
          y1={0.4 * height}
          x2={0.8 * width}
          y2={0.8 * height}
          onClick={() => undefined}
        />

        <Bracket
          x1={0.2 * width}
          y1={0.8 * height}
          x2={0.5 * width}
          y2={0.8 * height}
          onClick={() => undefined}
        />

        <Marker
          x1={0.2 * width}
          y1={0.59 * height}
          x2={0.8 * width}
          y2={0.59 * height}
          onClick={() => undefined}
        />
      </Svg>
      <MathJaxContext version={3} config={mathjaxConfig}>
        <Note
          x="1%"
          y="12%"
          html={`<h3>h3</h3>あいうえお<br/>かき $x$ くけこ $$\\int e^x dx$$ $10 / 3 \\approx 3.33$`}
          onClick={() => undefined}
        />
        <PageLink x="10%" y="50%" label="p. 100" onClick={() => undefined} />
      </MathJaxContext>
    </>
  );
};

export default Overlay;
