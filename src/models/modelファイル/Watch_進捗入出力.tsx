import { useAtom, useAtomValue } from "jotai";
import { Watch } from "../Watch/Watch";
import { PATH_COVERAGES } from "@/types/CONSTANTS";
import { modelフォルダ } from "../modelフォルダ/modelフォルダ";
import { atomsファイル } from "./atomsファイル";
import { getCoveragesWithValidPdfs } from "./utils/getCoveragesWithValidPdfs";
import { derivsファイル } from "./derivsファイル";
import type Coverages from "@/types/Coverages";

/**
 * 進捗ファイルの入出力を行う
 */
export function Watch_進捗入出力() {
  const folder = modelフォルダ.folder.useValue();
  const read = modelフォルダ.json.useRead();
  const save = modelフォルダ.json.useSave();
  const [coverages, setCoverages] = useAtom(atomsファイル.coverages);
  const fileTree = useAtomValue(derivsファイル.fileTreeValue);

  return (
    <>
      {/* folder が変化したら coverages を読み込む */}
      <Watch
        target={folder}
        onChange={async () => {
          // ファイルから読み込む
          const coverages0 = await read<Coverages>(PATH_COVERAGES, false);
          // ファイルツリーにない項目を削除する
          const coverages1 = getCoveragesWithValidPdfs(coverages0, fileTree);
          setCoverages(coverages1);
        }}
      />

      {/* coverages が変化したら保存する */}
      <Watch
        target={coverages}
        onChange={() => {
          void save(coverages, PATH_COVERAGES);
        }}
      />
    </>
  );
}
