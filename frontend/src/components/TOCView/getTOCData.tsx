import { Tooltip, Typography } from "@mui/material";
import { Notes, Page } from "@/types/Notes";

/**
 * 題名を返す
 */
const getBook = (i: number, title: string) => (
  <Typography
    key={`book-${i}`}
    variant="body1"
    sx={{
      whiteSpace: "nowrap",
      color: "gray",
      "&:not(:first-of-type)": { pt: 1 },
    }}
  >
    {title}
  </Typography>
);

/**
 * 部名を返す
 */
const getPart = (i: number, title: string) => (
  <Typography
    key={`part-${i}`}
    variant="body2"
    sx={{ whiteSpace: "nowrap", color: "gray", pt: 0.8 }}
  >
    {title}
  </Typography>
);

/**
 * 章名を返す
 */
const getChapter = (i: number, title: string) => (
  <Typography
    key={`chapter-${i}`}
    variant="body2"
    sx={{
      pt: 0.5,
      fontSize: "110%",
      lineHeight: 1,
      color: "gray",
      whiteSpace: "nowrap",
      minHeight: 6,
    }}
  >
    {title}
  </Typography>
);

/**
 * ページを返す
 */
const getPage = (
  i: number,
  pageNum: number,
  currentPage: number,
  page?: Page,
  onClick?: () => void
) => (
  <Tooltip
    key={`page-${i}`}
    title={`p. ${pageNum}`}
    disableInteractive
    enterDelay={0}
    leaveDelay={0}
  >
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        background: getPageColor(i, currentPage, page),
        marginRight: 2,
        marginBottom: 2,
        marginTop: 2,
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  </Tooltip>
);

/**
 * 節区切りを返す
 */
const getSeparator = (i: number) => (
  <span
    key={`separator-${i}`}
    style={{
      height: 11,
      width: 1,
      marginLeft: 2,
      marginRight: 4,
      background: "darkgray",
      display: "inline-block",
    }}
  />
);

/**
 * ページ内節区切りを返す
 */
const getSeparatorInner = (i: number) => (
  <span
    key={`separator-inner-${i}`}
    style={{
      position: "relative",
      left: -5,
      height: 11,
      width: 1,
      marginLeft: -1,
      background: "gray",
      display: "inline-block",
    }}
  />
);

/**
 * ページの色を返す
 */
const getPageColor = (i: number, currentPage: number, page?: Page) => {
  if (i === currentPage) {
    if (page?.excluded) return "lightpink";
    if (page?.notes) return "magenta";
    return "red";
  } else {
    if (page?.excluded) return "lightgray";
    if (page?.notes) return "limegreen";
    return "black";
  }
};

/**
 * @returns 目次の内容
 */
const getTOCData = (
  notes?: Notes,
  onChanged?: (notes: Notes) => void
): JSX.Element[] => {
  if (!notes) return [];
  const toc: JSX.Element[] = [];
  let pageNum = 1;
  for (let i = 0; i < notes.numPages; i++) {
    const page = notes.pages[i];

    // 第名を追加
    if (page?.book !== undefined) {
      toc.push(getBook(i, page.book));
    }
    // 部名を追加
    if (page?.part !== undefined) {
      toc.push(getPart(i, page.part));
    }
    // 章名を追加
    if (page?.chapter !== undefined) {
      toc.push(getChapter(i, page.chapter));
    }
    // 節区切りを追加
    if (page?.sectionBreak) {
      toc.push(getSeparator(i));
    }
    // ページを追加
    pageNum = page?.pageNumberRestart ?? pageNum;
    toc.push(
      getPage(i, pageNum, notes.currentPage, page, () => {
        onChanged?.({ ...notes, currentPage: i });
      })
    );
    // ページ内節区切りを追加
    if (page?.sectionBreakInner) {
      toc.push(getSeparatorInner(i));
    }
    ++pageNum;
  }
  return toc;
};

export default getTOCData;
