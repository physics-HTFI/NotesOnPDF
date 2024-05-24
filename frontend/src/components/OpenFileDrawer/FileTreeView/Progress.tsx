import { Coverage } from "@/types/Coverages";

/**
 * 進捗状況
 */
export default function Progress({ coverage }: { coverage?: Coverage }) {
  if (!coverage) return <></>;
  return (
    <>
      <div>総ページ： {`${coverage.allPages}`} ページ</div>
      {coverage.allPages !== coverage.enabledPages && (
        <div>有効ページ： {`${coverage.enabledPages}`} ページ</div>
      )}
      <div>ノート付き： {`${coverage.notedPages}`} ページ</div>
      <div>ノート率： {`${coverage.percent}`}%</div>
    </>
  );
}
