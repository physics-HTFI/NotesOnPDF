import IModel from "@/models/IModel";
import ModelDesktop from "@/models/Model.Desktop";
import ModelNull from "@/models/Model.Null";
import AppSettings from "@/types/AppSettings";
import { ReactNode, useContext, useEffect, useState } from "react";
import UiContext from "../UiContext";
import Coverages, { Coverage } from "@/types/Coverages";
import FileTree from "@/types/FileTree";
import CriticalError from "./CriticalError";
import ModelContext from "./ModelContext";
import useServerSideEvents from "./useServerSideEvents";

/**
 * `ModelContext`のプロバイダー
 */
export function ModelContextProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<IModel>(
    import.meta.env.VITE_IS_WEB === "true"
      ? new ModelNull()
      : new ModelDesktop()
  );
  const { readOnly, setAlert } = useContext(UiContext);
  const [appSettings, setAppSettings] = useState<AppSettings>();
  const [fileTree, setFileTree] = useState<FileTree>();
  const [coverages, setCoverages] = useState<Coverages>();
  const { serverFailed, rootDirectoryChanged } = useServerSideEvents(model);

  const initialized = !!appSettings && !!fileTree && !!coverages;

  // `appSettings, FileTree, Coverages`を取得する
  useEffect(() => {
    if (serverFailed || initialized) return;
    loadAll(model)
      .then(({ appSettings, fileTree, coverages }) => {
        setAppSettings(appSettings);
        setFileTree(fileTree);
        setCoverages(coverages);
      })
      .catch((e?: Error) => {
        if (!e?.message) return;
        setAlert("error", e.message);
      });
  }, [model, setAlert, serverFailed, initialized]);

  // `appSettings`を保存する
  useEffect(() => {
    if (!appSettings || readOnly) return;
    model.putAppSettings(appSettings).catch(() => {
      setAlert("error", "設定ファイルの保存に失敗しました");
    });
  }, [appSettings, model, readOnly, setAlert]);

  // `coverages`を保存する
  useEffect(() => {
    if (!coverages || readOnly) return;
    model.putCoverages(coverages).catch(() => {
      setAlert("error", "進捗率ファイルの保存に失敗しました");
    });
  }, [coverages, model, readOnly, setAlert]);

  return (
    <ModelContext.Provider
      value={{
        model,
        modelFlags: model.getFlags(),
        appSettings,
        fileTree,
        coverages,
        initialized,
        inert: serverFailed || rootDirectoryChanged,
        setModel,
        setAppSettings,
        setCoverages,
      }}
    >
      {children}

      {/* 起動待ち */}
      <CriticalError
        open={serverFailed && !rootDirectoryChanged}
        needsReload={false}
      >
        <>
          NotesOnPdf を起動してください
          <br />
          起動するのを待っています...
        </>
      </CriticalError>

      {/* 基準フォルダ変更によるリロード */}
      <CriticalError open={rootDirectoryChanged} needsReload={true}>
        <>
          設定が変更されました
          <br />
          リロードしてください
        </>
      </CriticalError>
    </ModelContext.Provider>
  );
}

/**
 * `AppSettings, FileTree, Coverages`を取得する
 */
async function loadAll(model: IModel) {
  const appSettings = await model.getAppSettings().catch(() => {
    throw new Error("設定ファイルの取得に失敗しました");
  });
  const fileTree = await model.getFileTree().catch(() => {
    throw new Error("ファイルツリーの取得に失敗しました");
  });
  const coverages = await model.getCoverages().catch(() => {
    throw new Error("進捗率ファイルの取得に失敗しました");
  });
  trimCoverages(coverages, fileTree);
  return { appSettings, fileTree, coverages };

  /** `Coverages`から、ファイルツリー内に存在しないファイルの情報を削除する */
  function trimCoverages(coverages: Coverages, fileTree: FileTree) {
    const pdfs: Record<string, Coverage> = {};
    for (const [id, coverage] of Object.entries(coverages.pdfs)) {
      if (!fileTree.some((f) => f.id === id)) continue;
      pdfs[id] = coverage;
    }
    coverages.pdfs = pdfs;
  }
}
