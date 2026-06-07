import { WatchBase } from "@/models/Watch/Watch";
import { useAtomValue } from "jotai";
import { mapUseOnChangeWatchPdfInfo } from "./mapUseOnChangeWatchPdfInfo";
import { modelPDFファイル } from "@/models/modelPDFファイル";

export function WatchPdfInfo() {
  const info = useAtomValue(modelPDFファイル.info.atom);
  return <WatchBase target={info} useOnChange={mapUseOnChangeWatchPdfInfo} />;
}
