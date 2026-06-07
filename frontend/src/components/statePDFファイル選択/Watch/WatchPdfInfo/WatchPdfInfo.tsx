import { Watch } from "@/components/share/Watch";
import { useAtomValue } from "jotai";
import { modelPDFファイル } from "../../modelPDFファイル";
import { mapUseOnChangeWatchPdfInfo } from "./mapUseOnChangeWatchPdfInfo";

export function WatchPdfInfo() {
  const info = useAtomValue(modelPDFファイル.info.atom);
  return <Watch target={info} useOnChange={mapUseOnChangeWatchPdfInfo} />;
}
