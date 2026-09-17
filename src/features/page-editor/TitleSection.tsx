// Page タイトルの表示・編集セクション。編集状態と保存は useEditSection が持つ。
import { EditActions, EditButton } from "./EditActions";
import { useEditSection } from "./useEditSection";

type TitleSectionProps = {
  title: string;
  onSave: (title: string) => Promise<unknown>;
};

export function TitleSection({ title, onSave }: TitleSectionProps) {
  const section = useEditSection(title, onSave);

  if (!section.editing) {
    return (
      <div className="flex gap-2.5 md:gap-5">
        <h1 className="flex-1 text-title leading-10 font-bold md:pl-7.5">
          {title === "" ? "無題" : title}
        </h1>
        <EditButton onClick={section.start} />
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 md:gap-5">
      <input
        // デザイン上は入力欄がタイトル表示と入れ替わるだけで、見えるラベルが無い。読み上げのために名前を付ける
        aria-label="タイトル"
        className="h-10 flex-1 rounded-lg border border-brand bg-white px-4 text-title md:px-7.5"
        value={section.draft}
        onChange={(e) => section.setDraft(e.target.value)}
      />
      <EditActions
        canSave={section.length >= 1 && section.length <= 50}
        onCancel={section.cancel}
        onSave={section.save}
      />
    </div>
  );
}
