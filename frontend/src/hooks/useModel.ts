import ModelContext from "@/contexts/ModelContext";
import UiStateContext from "@/contexts/UiStateContext";
import { useContext } from "react";

/**
 * `IModel`を、失敗時のメッセージ設定関数を返す
 */
export default function useModel() {
  const { model } = useContext(ModelContext);
  const { readOnly, setAccessFailedReason } = useContext(UiStateContext);

  return {
    model,
    readOnly,
    setAccessFailedReason,
  };
}
