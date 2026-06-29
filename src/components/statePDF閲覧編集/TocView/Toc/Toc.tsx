import { type ReactNode, useState } from "react";
import Separator from "./Separator";
import Page from "./Page";
import { MathJax } from "better-react-mathjax";
import Label from "./Label";
import "./style.css";
import { useAtomValue, type Atom } from "jotai";
import { modelPdfNotes } from "@/models/modelPdfNotes/modelPdfNotes";
import type PdfNotes from "@/types/PdfNotes";

/**
 * 目次の内容
 */
export function ToC() {
  const pages = modelPdfNotes.pdfNotes.usePages();
  const [openTooltips, setOpenTooltips] = useState<boolean[]>([]);
  const atomsIsSelectedPage = modelPdfNotes.atomsIsSelected.usePageValue();
  const atomsIsSelectedChapter =
    modelPdfNotes.atomsIsSelected.useChapterValue();

  if (pages.length !== openTooltips.length) {
    setOpenTooltips(new Array(pages.length).fill(false));
    return undefined;
  }

  const toc: ReactNode[] = [];
  for (let i = 0; i < pages.length; i++) {
    toc.push(
      <PageWithLabel
        key={`${i}`}
        i={i}
        pages={pages}
        atomIsSelectedPage={atomsIsSelectedPage[i]}
        atomIsSelectedChapter={atomsIsSelectedChapter[i]}
        openTooltips={openTooltips}
        setOpenTooltips={setOpenTooltips}
      />,
    );
  }
  return (
    <MathJax hideUntilTypeset={"first"} dynamic>
      {toc}
    </MathJax>
  );
}

function PageWithLabel({
  i,
  pages,
  atomIsSelectedPage,
  atomIsSelectedChapter,
  openTooltips,
  setOpenTooltips,
}: {
  i: number;
  pages: PdfNotes["pages"];
  atomIsSelectedPage: Atom<boolean>;
  atomIsSelectedChapter: Atom<boolean>;
  openTooltips?: boolean[];
  setOpenTooltips?: (openTooltips: boolean[]) => void;
}) {
  const jumpPage = modelPdfNotes.update.useJumpPage();
  const handleClick = () => jumpPage(i);
  const isSelectedPage = useAtomValue(atomIsSelectedPage);
  const isSelectedChapter = useAtomValue(atomIsSelectedChapter);
  const page = pages[i];
  const pageNum = page.num;

  return (
    <>
      {/* 巻名、部名、章名を追加 */}
      <Label key={`volume-${i}`} type="volume" pageNum={i} page={page} />
      <Label key={`part-${i}`} type="part" pageNum={i} page={page} />
      <Label
        key={`chapter-${i}`}
        type="chapter"
        pageNum={i}
        page={page}
        highlight={isSelectedChapter}
      />
      {/* 節区切りを追加 */}
      {page.style?.includes("break-before") && (
        <Separator
          key={`separator-${i}`}
          onClick={handleClick}
          tooltip={`p. ${pageNum}`}
          index={i}
          openTooltips={openTooltips}
          setOpenTooltips={setOpenTooltips}
        />
      )}
      {/* ページを追加 */}
      <Page
        key={`page-${i}`}
        sectionBreak={
          page.style?.includes("break-middle") ? "before" : undefined
        }
        tooltip={`p. ${pageNum}`}
        isCurrent={isSelectedPage}
        page={page}
        onClick={handleClick}
        index={i}
        openTooltips={openTooltips}
        setOpenTooltips={setOpenTooltips}
      />
      {page.style?.includes("break-middle") && (
        <>
          <Separator
            key={`separator-inner-${i}`}
            onClick={handleClick}
            tooltip={`p. ${pageNum}`}
            index={i}
            openTooltips={openTooltips}
            setOpenTooltips={setOpenTooltips}
          />
          <Page
            key={`page-right-${i}`}
            sectionBreak={
              page.style.includes("break-middle") ? "after" : undefined
            }
            tooltip={`p. ${pageNum}`}
            isCurrent={isSelectedPage}
            page={page}
            onClick={handleClick}
            index={i}
            openTooltips={openTooltips}
            setOpenTooltips={setOpenTooltips}
          />
        </>
      )}
    </>
  );
}
