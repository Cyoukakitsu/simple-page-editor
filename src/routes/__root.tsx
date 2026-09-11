import { Outlet, createRootRoute } from '@tanstack/react-router'

// レイアウトの骨組みのみ。Sidebar / MainArea の実装と UI はスタイル方針を
// 決めてから追加する。
export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return <Outlet />
}
