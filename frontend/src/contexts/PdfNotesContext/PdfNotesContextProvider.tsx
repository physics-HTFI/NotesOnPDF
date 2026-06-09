import { type ReactNode } from "react";
import PdfNotesContext from "./PdfNotesContext";
import useUpdaters from "./useUpdaters";

/**
 * `AppSettingsContext`のプロバイダー
 */
export function PdfNotesContextProvider({ children }: { children: ReactNode }) {
  const updaters = useUpdaters();

  return (
    <PdfNotesContext.Provider
      value={{
        updaters,
      }}
    >
      {children}
    </PdfNotesContext.Provider>
  );
}
