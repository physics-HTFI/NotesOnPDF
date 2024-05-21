import { useState } from "react";
import usePdfNotes from "@/hooks/usePdfNotes";
import Volume from "./Volume";
import Part from "./Part";
import Chapter from "./Chapter";
import Separator from "./Separator";
import Page from "./Page";

/**
 * @returns 目次の内容
 */
const ToC = () => {
  const { pdfNotes, jumpPage } = usePdfNotes();
  const [openTooltips, setOpenTooltips] = useState<boolean[]>([]);
  if (!pdfNotes) return [];
  if (pdfNotes.pages.length !== openTooltips.length) {
    setOpenTooltips(new Array(pdfNotes.pages.length).fill(false));
    return undefined;
  }

  const toc: JSX.Element[] = [];
  let pageNum = 1;
  for (let i = 0; i < pdfNotes.pages.length; i++) {
    const page = pdfNotes.pages[i];
    const handleClick = () => {
      jumpPage(i);
    };

    // 第名を追加
    if (page?.volume !== undefined) {
      toc.push(
        <Volume key={`volume-${i}`} title={page.volume} onClick={handleClick} />
      );
    }
    // 部名を追加
    if (page?.part !== undefined) {
      toc.push(
        <Part key={`part-${i}`} title={page.part} onClick={handleClick} />
      );
    }
    // 章名を追加
    if (page?.chapter !== undefined) {
      toc.push(
        <Chapter
          key={`Chapter-${i}`}
          title={page.chapter}
          onClick={handleClick}
        />
      );
    }
    // 節区切りを追加
    pageNum = page?.numberRestart ?? pageNum;
    if (page?.style?.includes("break-before")) {
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
        sectionBreakInner={page?.style?.includes("break-middle")}
        tooltip={`p. ${pageNum}`}
        isCurrent={i === pdfNotes.currentPage}
        page={page}
        onClick={handleClick}
        index={i}
        openTooltips={openTooltips}
        setOpenTooltips={setOpenTooltips}
      />
    );
    if (page?.style?.includes("break-middle")) {
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
  return toc;
};

export default ToC;
