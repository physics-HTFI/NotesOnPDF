import ModelContext from "@/contexts/ModelContext";
import UiStateContext from "@/contexts/UiStateContext";
import { useContext } from "react";

/**
 * `IModel`を、失敗時のメッセージ設定関数を返す
 */
export default function useModel() {
  const { model, setModel } = useContext(ModelContext);
  const { readOnly, setReadOnly, setAccessFailedReason } =
    useContext(UiStateContext);

  return {
    model,
    setModel,
    readOnly,
    setReadOnly,
    setAccessFailedReason,
  };
}
