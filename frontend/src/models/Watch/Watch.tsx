import { useAtomValue } from "jotai";
import { useState } from "react";
import { modelファイル } from "../modelファイル";
import { modelフォルダ } from "../modelフォルダ";
import { watchMaps } from "./watchMaps";
import { modelPdfNotes } from "../modelPdfNotes";

/**
 * 変更を監視したい変数を定義する
 */
export function Watch() {
  return (
    <>
      <WatchFolder />
      <WatchPdfPath />
      <WatchPdfNotes />
      <WatchPdfLoaded />
      <WatchPdfFullLoaded />
      <WatchCurrentPage />
    </>
  );
}

//|
//| private
//|

function WatchFolder() {
  const folder = useAtomValue(modelフォルダ.folder.atom);
  return <WatchBase target={folder} useOnChange={watchMaps.folder} />;
}

function WatchPdfPath() {
  const path = useAtomValue(modelファイル.pdf.atomPath);
  return <WatchBase target={path} useOnChange={watchMaps.pdfPath} />;
}

function WatchPdfNotes() {
  const pdfNotes = useAtomValue(modelPdfNotes.pdfNotes.atom);
  return <WatchBase target={pdfNotes} useOnChange={watchMaps.pdfNotes} />;
}

function WatchPdfLoaded() {
  const loaded = useAtomValue(modelファイル.pdf.atomLoadedValue);
  return <WatchBase target={loaded} useOnChange={watchMaps.pdfLoaded} />;
}

function WatchPdfFullLoaded() {
  const pdfNotes = useAtomValue(modelPdfNotes.pdfNotes.atom);
  const pdfLoaded = useAtomValue(modelファイル.pdf.atomLoadedValue);
  const loaded = pdfNotes && pdfLoaded;
  return <WatchBase target={loaded} useOnChange={watchMaps.pdfFullLoaded} />;
}

function WatchCurrentPage() {
  const currentPage = useAtomValue(modelPdfNotes.pdfNotes.atom)?.currentPage;
  return <WatchBase target={currentPage} useOnChange={watchMaps.currentPage} />;
}

/**
 * `target` が変更されたときに、`onChange`（＝ `useOnChange` の戻り値）を実行する
 */
function WatchBase<T>({
  target,
  useOnChange,
}: {
  target: T;
  useOnChange: Map<string, () => (t: T) => void>;
}) {
  const [currentTarget, setCurrentTarget] = useState<T>();
  const onChange = Array.from(useOnChange).map(([, use]) => use());

  if (currentTarget !== target) {
    setTimeout(() => {
      setCurrentTarget(target);
      for (const handle of onChange) {
        handle(target);
      }
    }, 0);
  }
  return <></>;
}

// useOnChange の型を Map にしているのは、ホットリロードの時に、
// モジュールが再度実行されてカスタムフックの数が変わって、エラーになるのを防ぐため。

// setTimeout せずに直接 setState すると以下のエラーが出る：
// Cannot update a component (A) while rendering a different component (B)
// そのため、atom が変化したときのリレンダー中に setState/setAtom するのは避けるべき。
// useEffect を使うという手もあるが、カスタムフック由来の関数があると、その関数については
// useCallback 化しておくする必要があるのと、更新タイミングが読みづらくなるので避ける。
