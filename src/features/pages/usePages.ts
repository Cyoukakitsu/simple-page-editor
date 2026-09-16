// ページ一覧のサーバー状態（TanStack Query）。エラー通知は queryClient 側で一括して出す。
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as pageApi from "../../api/pageApi";

const pagesKey = ["pages"];

export function usePages() {
  const queryClient = useQueryClient();

  // ---- 一覧取得 ----
  const { data: pages = [] } = useQuery({
    queryKey: pagesKey,
    queryFn: pageApi.fetchPages,
  });

  // ---- 更新・作成・削除（成功したら一覧を再取得） ----
  const invalidatePages = () =>
    queryClient.invalidateQueries({ queryKey: pagesKey });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: { title?: string; body?: string } }) =>
      pageApi.updatePage(id, patch),
    onSuccess: invalidatePages,
  });
  const createMutation = useMutation({
    mutationFn: pageApi.createPage,
    onSuccess: invalidatePages,
  });
  const deleteMutation = useMutation({
    mutationFn: pageApi.deletePage,
    onSuccess: invalidatePages,
  });

  return {
    pages,
    // 保存の成否を呼び出し側が待てるよう Promise を返す
    updatePage: updateMutation.mutateAsync,
    createPage: createMutation.mutate,
    deletePage: deleteMutation.mutate,
  };
}
