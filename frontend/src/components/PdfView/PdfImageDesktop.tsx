import { useContext, useRef, useState } from "react";
import MouseContext from "@/contexts/MouseContext";
import PageLabelLarge from "./PageLabelLarge";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import UiContext from "@/contexts/UiContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * PDF画像を表示するコンポーネント
 */
export default function PdfImageDesktop() {
  const { model } = useContext(ModelContext);
  const { setAlert } = useContext(UiContext);
  const { pageRect } = useContext(MouseContext);
  const {
    id,
    pageLabel,
    imageNum,
    updaters: { jumpPageEnd },
  } = useContext(PdfNotesContext);
  const [src, setSrc] = useState("");
  const [reading, setReading] = useState(false);
  const nextSrc = useRef("");
  console.log(imageNum);

  if (!id || !pageRect || imageNum === undefined) {
    return <></>;
  }

  const width = Math.round(pageRect.width);
  const height = Math.round(pageRect.height);
  try {
    nextSrc.current = model.getPageImageUrl(id, imageNum, width, height);
  } catch {
    setAlert("error", "ページ画像の取得に失敗しました");
  }
  // 現在の読み込みが終了してから次の読み込みを行う
  if (!reading && nextSrc.current !== src) {
    setSrc(nextSrc.current);
    if (nextSrc.current.split("?")[0] != src.split("?")[0]) {
      setReading(true);
    }
  }

  return (
    <>
      <img
        src={src}
        style={{
          width,
          height,
          objectFit: reading ? "none" : undefined,
        }}
        onLoad={() => {
          setReading(false);
          jumpPageEnd(imageNum);
        }}
        onError={() => {
          setReading(false);
          setAlert("error", "ページ画像の取得に失敗しました");
        }}
      />
      <PageLabelLarge label={pageLabel} shown={reading} />
    </>
  );
}
