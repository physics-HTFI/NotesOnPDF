import { WatchBase } from "@/models/Watch/Watch";
import { useAtomValue } from "jotai";
import { modelフォルダ } from "../../modelフォルダ";
import { mapUseOnChangeWatchFolder } from "./mapUseOnChangeWatchFolder";

export function WatchFolder() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  return <WatchBase target={folder} useOnChange={mapUseOnChangeWatchFolder} />;
}
