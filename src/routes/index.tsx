import { createFileRoute } from '@tanstack/react-router'

// プレースホルダー。UI 実装フェーズで Page 一覧選択後の
// リダイレクトや空状態表示に置き換える。
export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return <div>TODO: page list / empty state</div>
}
