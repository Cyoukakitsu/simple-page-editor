// Page 本文の表示・編集セクション。編集状態と保存は useEditSection が持つ。
import { EditActions, EditButton } from "./EditActions";
import { useEditSection } from "./useEditSection";

type BodySectionProps = {
  body: string;
  onSave: (body: string) => Promise<unknown>;
};

export function BodySection({ body, onSave }: BodySectionProps) {
  const section = useEditSection(body, onSave);

  if (!section.editing) {
    return (
      <div className="flex min-h-0 flex-1 gap-2.5 md:gap-5">
        <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-white p-4 md:p-7.5">
          <p className="whitespace-pre-wrap text-body">{body}</p>
        </div>
        <EditButton onClick={section.start} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 gap-2.5 md:gap-5">
      <div className="flex min-h-0 flex-1 flex-col">
        <textarea
          // 見えるラベルが無いので読み上げ用の名前を付け、文字数の制限はカウンタの文と結びつける
          aria-label="本文"
          aria-describedby="body-counter"
          className="min-h-0 flex-1 resize-none rounded-lg border border-brand bg-white p-4 text-body md:p-7.5"
          value={section.draft}
          onChange={(e) => section.setDraft(e.target.value)}
        />
        {/* カウンタは判定と同じ値（trim 後）を出して、食い違いが見えないようにする */}
        <p id="body-counter" className="mt-1 text-caption text-text-muted">
          {section.length}/2000文字 (10〜2000文字で入力してください)
        </p>
      </div>
      <EditActions
        canSave={section.length >= 10 && section.length <= 2000}
        onCancel={section.cancel}
        onSave={section.save}
      />
    </div>
  );
}
