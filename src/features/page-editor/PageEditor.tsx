// Page 詳細エリア全体。タイトル・本文それぞれの編集セクションを並べるだけの組み立て役。
import { BodySection } from "./BodySection";
import { TitleSection } from "./TitleSection";

type Page = {
  id: number;
  title: string;
  body: string;
};

type PageEditorProps = {
  page: Page;
  // 保存が成功したら resolve、失敗したら reject する。各セクションは成功時だけ編集を終える
  onSave: (patch: { title?: string; body?: string }) => Promise<unknown>;
};

export function PageEditor({ page, onSave }: PageEditorProps) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-2xl bg-bg-canvas p-7.5">
      <TitleSection
        key={`title-${page.id}`}
        title={page.title}
        onSave={(title) => onSave({ title })}
      />
      <BodySection
        key={`body-${page.id}`}
        body={page.body}
        onSave={(body) => onSave({ body })}
      />
    </div>
  );
}
