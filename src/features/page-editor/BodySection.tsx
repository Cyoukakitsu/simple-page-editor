// Page 本文の表示・編集セクション。Edit → Cancel/Save で独立した編集状態を持つ。
import { useState } from "react";

import { Button } from "../../components/ui/Button";
import cancelIconUrl from "../../../icon/cancel.svg";
import editIconUrl from "../../../icon/edit.svg";
import saveIconUrl from "../../../icon/save.svg";

type BodySectionProps = {
  body: string;
  onSave: (body: string) => void;
};

export function BodySection({ body, onSave }: BodySectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);

  if (!editing) {
    return (
      <div className="flex min-h-0 flex-1 gap-5">
        <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-white p-7.5">
          <p className="whitespace-pre-wrap text-body">{body}</p>
        </div>
        <div className="flex w-22.5 shrink-0">
          <Button
            variant="primary"
            icon={<img src={editIconUrl} alt="" className="h-6 w-6" />}
            onClick={() => {
              setDraft(body);
              setEditing(true);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }

  // 空白だけの本文を弾くため trim() してから長さを見る
  const isValid = draft.trim().length >= 10 && draft.trim().length <= 2000;

  return (
    <div className="flex min-h-0 flex-1 gap-5">
      <div className="flex min-h-0 flex-1 flex-col">
        <textarea
          className="min-h-0 flex-1 resize-none rounded-lg border border-brand bg-white p-7.5 text-body"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <p className="mt-1 text-caption text-text-muted">
          {draft.length}/2000文字 (10〜2000文字で入力してください)
        </p>
      </div>
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
