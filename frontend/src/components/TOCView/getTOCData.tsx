import { Typography } from "@mui/material";
import { Notes, Page } from "@/types/Notes";

/**
 * 題名を返す
 */
const getBook = (key: string, title: string) => (
  <Typography key={key} variant="body1" gutterBottom>
    {title}
  </Typography>
);

/**
 * 部名を返す
 */
const getPart = (key: string, title: string) => (
  <Typography key={key} variant="body2" gutterBottom>
    {title}
  </Typography>
);

/**
 * 章名を返す
 */
const getChapter = (key: string, title: string) => (
  <Typography key={key} variant="body2" gutterBottom>
    {title}
  </Typography>
);

/**
 * 節を返す
 */
const getSection = (key: string, section: JSX.Element[]) => (
  <span
    key={key}
    style={{
      marginRight: 5,
      display: "inline-block",
      hyphens: "auto",
    }}
  >
    {section}
  </span>
);

/**
 * ページの色を返す
 */
const getPageColor = (i: number, currentPage: number, page?: Page) => {
  if (i === currentPage) {
    if (page?.excluded) return "lightpink";
    //if(page?.notes) return "gold";
    return "red";
  } else {
    if (page?.excluded) return "lightgray";
    //if(page?.notes) return "green";
    return "black";
  }
};

/**
 * TODO 節が長いと途中で改行されて、新規の節と紛らわしい。ハイフンなどがつけられれば良いが。
 * @returns 目次の内容
 */
const getTOCData = (notes?: Notes): JSX.Element[] => {
  if (!notes) return [];
  const toc: JSX.Element[] = [];
  let section: JSX.Element[] = [];
  for (let i = 0; i < notes.numPages; i++) {
    const page = notes.pages[i];

    // 節を追加
    if (i !== 0) {
      if (
        page?.book !== undefined ||
        page?.part !== undefined ||
        page?.chapter !== undefined ||
        page?.sectionBreak
      ) {
        toc.push(getSection(`section-${i}`, section));
        section = [];
      }
    }
    // 第名を追加
    if (page?.book !== undefined) {
      toc.push(getBook(`book-${i}`, page.book));
    }
    // 部名を追加
    if (page?.part !== undefined) {
      toc.push(getPart(`part-${i}`, page.part));
    }
    // 章名を追加
    if (page?.chapter !== undefined) {
      toc.push(getChapter(`chapter-${i}`, page.chapter));
    }
    // 節にページを追加
    section.push(
      <span
        key={`page-${i}`}
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          background: getPageColor(i, notes.currentPage, page),
          marginRight: 2,
        }}
      />
    );
  }
  toc.push(getSection(`section-last`, section));
  return toc;
};

export default getTOCData;