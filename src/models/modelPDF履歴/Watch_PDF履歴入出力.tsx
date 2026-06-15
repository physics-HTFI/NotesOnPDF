import { useAtom } from "jotai";
import { modelフォルダ } from "../modelフォルダ/modelフォルダ";
import { atomsPDF履歴 } from "./atomsPDF履歴";
import type { PdfHistory } from "@/types/History";
import { PATH_HISTORY } from "@/types/CONSTANTS";
import { Watch } from "../Watch/Watch";

/**
 * PDF 履歴の入出力を行う
 */
export function Watch_PDF履歴入出力() {
  const folder = modelフォルダ.folder.useValue();
  const read = modelフォルダ.json.useRead();
  const save = modelフォルダ.json.useSave();
  const [history, setHistory] = useAtom(atomsPDF履歴.history);

  return (
    <>
      {/* folder が変化したときに履歴を読み込む */}
      <Watch
        target={folder}
        onChange={async () => {
          const history = await read<PdfHistory>(PATH_HISTORY, false);
          setHistory(history ?? []);
        }}
      />

      {/* history が変化したときに履歴を保存する */}
      <Watch target={history} onChange={() => save(history, PATH_HISTORY)} />
    </>
  );
}
