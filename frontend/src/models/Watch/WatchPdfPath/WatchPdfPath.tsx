import { WatchBase } from "@/models/Watch/Watch";
import { useAtomValue } from "jotai";
import { mapUseOnChangeWatchPdfPath } from "./mapUseOnChangeWatchPdfInfo";
import { modelPDFファイル } from "@/models/modelPDFファイル";

export function WatchPdfPath() {
  const path = useAtomValue(modelPDFファイル.path.atom);
  return <WatchBase target={path} useOnChange={mapUseOnChangeWatchPdfPath} />;
}
