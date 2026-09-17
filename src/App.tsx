// 画面全体の組み立て役。Sidebar と MainArea の2カラムを並べ、選択中のページと、削除・作成時の選択の扱いを管理する。
import { useState } from "react";
import { toast } from "sonner";

import { PageEditor } from "./features/page-editor/PageEditor";
import { usePages } from "./features/pages/usePages";
import { Sidebar } from "./features/sidebar/Sidebar";


export function App() {
  // ---- サーバー状態 ----
  // ページ一覧と更新・作成・削除。成功後の再取得とエラー通知は usePages / queryClient 側が担う
  const { pages, updatePage, createPage, deletePage } = usePages();

  // ---- 選択状態 ----
  // Sidebar と MainArea の両方が参照するので、共通の親であるここで持つ。
  // 初期表示ではページを選択しない（MainArea は空状態から始まる）
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // 一覧の再取得で消えたページを選択していた場合も null になり、空状態が出る
  const selectedPage = pages.find((page) => page.id === selectedId) ?? null;

  // ---- 操作 ----
  // 削除成功後、消したのが選択中のページなら選択を外す（MainArea は空状態になる）。
  // 後端に復元 API が無いので、作成時と違って取り消しボタンは付けない
  const handleDelete = (id: number) => {
    deletePage(id, {
      onSuccess: () => {
        setSelectedId((current) => (current === id ? null : current));
        toast("ページを削除しました");
      },
    });
  };

  // 作成したページはすぐ編集できるよう選択する。並び順は Sidebar 側が createdAt 降順で面倒を見る
  const handleCreate = () => {
    createPage(undefined, {
      onSuccess: (page) => {
        setSelectedId(page.id);
        // 確認ダイアログの代わりに、作成後に取り消せるようにする
        toast("新しいページを作成しました", {
          action: { label: "取り消す", onClick: () => handleDelete(page.id) },
        });
      },
    });
  };

  // ---- レイアウト ----
  // md 以上は2カラム。md 未満は画面が狭いので単ペインにし、選択の有無でどちらか一方だけを出す
  return (
    <div className="flex h-dvh">
      {/* 左カラム: Sidebar（md 以上は固定幅） */}
      <div
        className={`w-full shrink-0 md:w-70 md:border-r md:border-bg-canvas ${
          selectedPage ? "max-md:hidden" : ""
        }`}
      >
        <Sidebar
          pages={pages}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </div>
      {/* 右カラム: MainArea（選択中ページの編集エリア）とフッター */}
      <div
        className={`flex flex-1 flex-col px-4 pt-5 md:px-10 md:pt-7.5 ${
          selectedPage ? "" : "max-md:hidden"
        }`}
      >
        {/* 単ペイン時に一覧へ戻る導線。md 以上は Sidebar が常に見えているので出さない */}
        <button
          type="button"
          className="mb-2.5 shrink-0 self-start text-body text-brand md:hidden"
          onClick={() => setSelectedId(null)}
        >
          ← 一覧へ
        </button>
        <div className="min-h-0 flex-1">
          {selectedPage ? (
            <PageEditor
              page={selectedPage}
              onSave={(patch) => updatePage({ id: selectedPage.id, patch })}
            />
          ) : (
            // ページ未選択の空状態（初期表示と、選択中のページを削除した直後）。
            // md 未満では未選択のとき右カラムごと隠れるので、これが出るのは md 以上のみ
            <div className="flex h-full items-center justify-center rounded-2xl bg-bg-canvas text-body text-text-muted">
              ページを選択してください
            </div>
          )}
        </div>
        <footer className="flex h-15 items-center justify-between text-caption text-text">
          <span>Copyright © 2021 Sample</span>
          <span>運営会社</span>
        </footer>
      </div>
    </div>
  );
}
