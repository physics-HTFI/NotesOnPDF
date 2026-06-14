import { useAtomValue } from "jotai";
import { useState } from "react";
import { modelファイル } from "../modelファイル/modelファイル";
import { modelフォルダ } from "../modelフォルダ/modelフォルダ";
import { watchMaps } from "./watchMaps";
import { modelPdfNotes } from "../modelPdfNotes";
import { Watch_PDF履歴入出力 } from "../modelPDF履歴/Watch_PDF履歴入出力";
import { Watch_ドロワー開閉 } from "../modelUI/Watch_ドロワー開閉";
import { Watch_PDF履歴追加 } from "../modelPDF履歴/Watch_PDF履歴追加";
import { atomsファイル } from "../modelファイル/atomsファイル";
import { Watch_PDF描画 } from "../modelファイル/Watch_PDF描画";
import { Watch_設定入出力 } from "../modelファイル/Watch_設定入出力";
import { Watch_進捗更新 } from "../modelファイル/Watch_進捗更新";
import { Watch_進捗入出力 } from "../modelファイル/Watch_進捗入出力";

/**
 * 変更を監視したい変数を定義する
 */
export function WatchAll() {
  return (
    <>
      <Watch_PDF履歴入出力 />
      <Watch_PDF履歴追加 />
      <Watch_ドロワー開閉 />
      <Watch_PDF描画 />
      <Watch_設定入出力 />
      <Watch_進捗入出力 />
      <Watch_進捗更新 />

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
  const folder = modelフォルダ.folder.useValue();
  return <WatchUse target={folder} useOnChange={watchMaps.folder} />;
}

function WatchPdfPath() {
  const path = modelファイル.pdf.path.useValue();
  return <WatchUse target={path} useOnChange={watchMaps.pdfPath} />;
}

function WatchPdfNotes() {
  const pdfNotes = useAtomValue(modelPdfNotes.pdfNotes.atom);
  return <WatchUse target={pdfNotes} useOnChange={watchMaps.pdfNotes} />;
}

function WatchPdfLoaded() {
  const loaded = useAtomValue(atomsファイル.pdf.info).status === "loaded";
  return <WatchUse target={loaded} useOnChange={watchMaps.pdfLoaded} />;
}

function WatchPdfFullLoaded() {
  const pdfNotes = useAtomValue(modelPdfNotes.pdfNotes.atom);
  const pdfLoaded = useAtomValue(atomsファイル.pdf.info).status === "loaded";
  const loaded = pdfNotes && pdfLoaded;
  return <WatchUse target={loaded} useOnChange={watchMaps.pdfFullLoaded} />;
}

function WatchCurrentPage() {
  const currentPage = useAtomValue(modelPdfNotes.atoms.currentPage);
  return <WatchUse target={currentPage} useOnChange={watchMaps.currentPage} />;
}

/**
 * `target` が変更されたときに、`onChange`（＝ `useOnChange` の戻り値）を実行する
 */
export function WatchUse<T>({
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
