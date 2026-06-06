import type IModel from "@/models/IModel";
import ModelNull from "@/models/Model.Null";
import type AppSettings from "@/types/AppSettings";
import { GetAppSettings_default } from "@/types/AppSettings";
import { type ReactNode, useEffect, useState } from "react";
import type Coverages from "@/types/Coverages";
import type { Coverage } from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";
import ModelContext from "./ModelContext";
import { modelUi } from "@/global/modelUi";

/**
 * `ModelContext`のプロバイダー
 */
export function ModelContextProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<IModel>(() => new ModelNull());
  const setAlert = modelUi.alert.useSet();
  const [appSettings, setAppSettings] = useState<AppSettings>();
  const [fileTree, setFileTree] = useState<FileTree>();
  const [coverages, setCoverages] = useState<Coverages>();
  const [initialized, setInitialized] = useState(false);

  // `appSettings, FileTree, Coverages`を取得する
  useEffect(() => {
    return;
    loadAll(model)
      .then(({ appSettings, fileTree, coverages }) => {
        setAppSettings(appSettings);
        setFileTree(fileTree);
        setCoverages(coverages);
        setInitialized(true);
      })
      .catch((e?: Error) => {
        if (!e?.message) return;
        setAlert("error", e.message);
      });
  }, [model, setAlert]);

  return (
    <ModelContext.Provider
      value={{
        model,
        appSettings,
        fileTree,
        coverages,
        initialized,
        inert: false, // Desuktop 用
        setModel,
        setAppSettings,
        setCoverages,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

/**
 * `AppSettings, FileTree, Coverages`を取得する
 */
async function loadAll(model: IModel) {
  const appSettings: AppSettings = {
    ...GetAppSettings_default(),
    ...(await model.getAppSettings().catch(() => {
      throw new Error("設定ファイルの取得に失敗しました");
    })),
  };
  const fileTree = await model.getFileTree().catch(() => {
    throw new Error("ファイルツリーの取得に失敗しました");
  });
  const coverages = await model.getCoverages().catch(() => {
    throw new Error("進捗率ファイルの取得に失敗しました");
  });
  trimCoverages(coverages, fileTree);
  return { appSettings, fileTree, coverages };

  /** `Coverages`から、ファイルツリー内に存在しないファイルの情報を削除する */
  function trimCoverages(coverages: Coverages, fileTree?: FileTree) {
    const pdfs: Record<string, Coverage> = {};
    if (fileTree) {
      for (const [path, coverage] of Object.entries(coverages.pdfs)) {
        if (!findTreeItem(fileTree, path)) continue;
        pdfs[path] = coverage;
      }
    }
    coverages.pdfs = pdfs;
  }
}
