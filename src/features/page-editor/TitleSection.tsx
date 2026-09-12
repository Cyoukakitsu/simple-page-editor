// Page タイトルの表示・編集セクション。Edit → Cancel/Save で独立した編集状態を持つ。
import { useState } from "react";

import { Button } from "../../components/ui/Button";
import cancelIconUrl from "../../../icon/cancel.svg";
import editIconUrl from "../../../icon/edit.svg";
import saveIconUrl from "../../../icon/save.svg";

type TitleSectionProps = {
  title: string;
  onSave: (title: string) => void;
};

export function TitleSection({ title, onSave }: TitleSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  if (!editing) {
    return (
      <div className="flex gap-5">
        <h1 className="flex-1 pl-7.5 text-title leading-10 font-bold">
          {title === "" ? "無題" : title}
        </h1>
        <div className="flex w-22.5 shrink-0">
          <Button
            variant="primary"
            icon={<img src={editIconUrl} alt="" className="h-6 w-6" />}
            onClick={() => {
              setDraft(title);
              setEditing(true);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }

  // 空白だけのタイトルを弾くため trim() してから長さを見る
  const isValid = draft.trim().length >= 1 && draft.trim().length <= 50;

  return (
    <div className="flex gap-5">
      <input
        className="h-10 flex-1 rounded-lg border border-brand bg-white px-7.5 text-title"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <div className="flex w-22.5 shrink-0 gap-2.5">
        <Button
          variant="normal"
          width="square"
          icon={<img src={cancelIconUrl} alt="" className="h-6 w-6" />}
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          width="square"
          icon={<img src={saveIconUrl} alt="" className="h-6 w-6" />}
          disabled={!isValid}
          onClick={() => {
            onSave(draft);
            setEditing(false);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
