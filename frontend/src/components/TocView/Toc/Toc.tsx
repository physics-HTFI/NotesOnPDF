import { ReactNode, useContext, useState } from "react";
import Separator from "./Separator";
import Page from "./Page";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { MathJax } from "better-react-mathjax";
import Label from "./Label";

/**
 * @returns 目次の内容
 */
const ToC = () => {
  const {
    pdfNotes,
    updaters: { jumpPage, getChpapterStartPageNum },
  } = useContext(PdfNotesContext);
  const [openTooltips, setOpenTooltips] = useState<boolean[]>([]);
  if (!pdfNotes) return [];
  if (pdfNotes.pages.length !== openTooltips.length) {
    setOpenTooltips(new Array(pdfNotes.pages.length).fill(false));
    return undefined;
  }
  const chapterStart = getChpapterStartPageNum();

  const toc: ReactNode[] = [];
  let pageNum = 1;
  for (let i = 0; i < pdfNotes.pages.length; i++) {
    const page = pdfNotes.pages[i];
    if (!page) continue;
    const handleClick = () => {
      jumpPage(i);
    };

    // 巻名、部名、章名を追加
    toc.push(
      <Label key={`volume-${i}`} type="volume" pageNum={i} page={page} />
    );
    toc.push(<Label key={`part-${i}`} type="part" pageNum={i} page={page} />);
    toc.push(
      <Label
        key={`chapter-${i}`}
        type="chapter"
        pageNum={i}
        page={page}
        highlight={i === chapterStart}
      />
    );
    // 節区切りを追加
    pageNum = page.numRestart ?? pageNum;
    if (page.style?.includes("break-before")) {
      toc.push(
        <Separator
          key={`separator-${i}`}
          onClick={handleClick}
          tooltip={`p. ${pageNum}`}
          index={i}
          openTooltips={openTooltips}
          setOpenTooltips={setOpenTooltips}
        />
      );
    }
    // ページを追加
    toc.push(
      <Page
        key={`page-${i}`}
        sectionBreakInner={page.style?.includes("break-middle")}
        tooltip={`p. ${pageNum}`}
        isCurrent={i === pdfNotes.currentPage}
        page={page}
        onClick={handleClick}
        index={i}
        openTooltips={openTooltips}
        setOpenTooltips={setOpenTooltips}
      />
    );
    if (page.style?.includes("break-middle")) {
      toc.push(
        <Separator
          key={`separator-inner-${i}`}
          onClick={handleClick}
          tooltip={`p. ${pageNum}`}
          index={i}
          openTooltips={openTooltips}
          setOpenTooltips={setOpenTooltips}
        />
      );
      toc.push(
        <Page
          key={`page-right-${i}`}
          sectionBreakInner={page.style.includes("break-middle")}
          tooltip={`p. ${pageNum}`}
          isCurrent={i === pdfNotes.currentPage}
          page={page}
          onClick={handleClick}
          index={i}
          openTooltips={openTooltips}
          setOpenTooltips={setOpenTooltips}
        />
      );
    }
    ++pageNum;
  }
  return (
    <MathJax hideUntilTypeset={"first"} dynamic>
      {toc}
    </MathJax>
  );
};

export default ToC;
