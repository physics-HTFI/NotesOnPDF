import { useEffect } from "react";
import SnackbarsMock from "./components/Fullscreen/SnackbarMock";
import { PdfNotesContextProvider } from "./contexts/PdfNotesContext";
import { AppSettingsContextProvider } from "./contexts/AppSettingsContext";
import { UiStateContextProvider } from "./contexts/UiStateContext";
import Main from "./components/Main";

function App() {
  // 初回に1度だけ行う処理
  useEffect(() => {
    document.onselectstart = () => false;
    document.oncontextmenu = () => false;
    return () => {
      document.onselectstart = null;
      document.oncontextmenu = null;
    };
  }, []);

  return (
    <AppSettingsContextProvider>
      <PdfNotesContextProvider>
        <UiStateContextProvider>
          <Main />
          {/* モックモデルを使用していることを示すポップアップ表示 */}
          {import.meta.env.VITE_IS_MOCK === "true" && <SnackbarsMock open />}
        </UiStateContextProvider>
      </PdfNotesContextProvider>
    </AppSettingsContextProvider>
  );
}

export default App;
