import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageEditor } from "../features/page-editor/PageEditor";
import { Sidebar } from "../features/sidebar/Sidebar";

// 動作確認用の仮データ。src/api 実装後は GET /content の結果に置き換える。
const samplePages = [
  {
    id: 1,
    title: "こころ",
    body: "親譲りの無鉄砲で小供の時から損ばかりしている。",
    createdAt: "2026-09-10T10:00:00.000Z",
  },
  {
    id: 2,
    title: "我輩は猫である",
    body: "吾輩は猫である。名前はまだ無い。",
    createdAt: "2026-09-11T10:00:00.000Z",
  },
  {
    id: 3,
    title: "坊っちゃん",
    body: "親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。",
    createdAt: "2026-09-12T10:00:00.000Z",
  },
];

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const [pages, setPages] = useState(samplePages);
  const [selectedId, setSelectedId] = useState<number | null>(
    samplePages[2].id,
  );

  const selectedPage = pages.find((page) => page.id === selectedId) ?? null;

  const handleSave = (patch: { title?: string; body?: string }) => {
    if (selectedId === null) return;
    setPages((prev) =>
      prev.map((page) =>
        page.id === selectedId ? { ...page, ...patch } : page,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setPages((prev) => prev.filter((page) => page.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleCreate = () => {
    // 並び順は Sidebar 側が createdAt 降順で面倒を見るので、ここでは追加するだけ
    const newPage = {
      id: Date.now(),
      title: "",
      body: "",
      createdAt: new Date().toISOString(),
    };
    setPages((prev) => [...prev, newPage]);
    setSelectedId(newPage.id);
  };

  return (
    <div className="flex h-screen">
      <div className="w-70 shrink-0 border-r border-bg-canvas">
        <Sidebar
          pages={pages}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </div>
      <div className="flex flex-1 flex-col px-10 pt-7.5">
        {/* ページ未選択のときはルート側（index.tsx）の空状態を出す */}
        <div className="min-h-0 flex-1">
          {selectedPage ? (
            <PageEditor page={selectedPage} onSave={handleSave} />
          ) : (
            <Outlet />
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
