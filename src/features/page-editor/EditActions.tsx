// タイトル・本文の各セクションが共通で使うボタン。表示中は Edit 1つ、編集中は Cancel/Save の対になる。
import { Button } from "../../components/ui/Button";
import cancelIconUrl from "../../../icon/cancel.svg";
import editIconUrl from "../../../icon/edit.svg";
import saveIconUrl from "../../../icon/save.svg";

// ---- 表示中 ----
export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex w-22.5 shrink-0">
      <Button
        variant="primary"
        icon={<img src={editIconUrl} alt="" className="h-6 w-6" />}
        onClick={onClick}
      >
        Edit
      </Button>
    </div>
  );
}

// ---- 編集中 ----
type EditActionsProps = {
  // 文字数がバリデーションの範囲内かどうか。範囲外の間は Save を押せなくする
  canSave: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export function EditActions({ canSave, onCancel, onSave }: EditActionsProps) {
  return (
    <div className="flex w-22.5 shrink-0 gap-2.5">
      <Button
        variant="normal"
        width="square"
        icon={<img src={cancelIconUrl} alt="" className="h-6 w-6" />}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        width="square"
        icon={<img src={saveIconUrl} alt="" className="h-6 w-6" />}
        disabled={!canSave}
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  );
}
