import { createFileRoute } from "@tanstack/react-router";

// ページが選択されていないとき（初期表示・選択中のページを削除した直後）の空状態。
export const Route = createFileRoute("/")({
  component: EmptyState,
});

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl bg-bg-canvas text-body text-text-muted">
      ページを選択してください
    </div>
  );
}
