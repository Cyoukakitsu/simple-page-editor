// バックエンドの /content エンドポイントに対応する薄いラッパー（fetch + zod でレスポンスを実行時検証）。
// 後端の名前 Content はこのファイルの中だけで使い、外へは Page として出す（CONTEXT.md）。
import { z } from "zod";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---- レスポンスの検証 ----
// Content 1件の形。ここを通ったものだけを Page として外に出す。
// title/body は DB 上 nullable だが、UI が空文字で「無題」を判定するので空文字にそろえる
const contentSchema = z.object({
  id: z.number(),
  title: z.string().nullish().transform((value) => value ?? ""),
  body: z.string().nullish().transform((value) => value ?? ""),
  createdAt: z.string(),
});

// 検証ルールから型を導く（ルールと型が二重管理にならない）
export type Page = z.infer<typeof contentSchema>;

async function request(method: string, path: string, body?: object): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`${method} ${path} が失敗しました（${res.status}）`);
  }
  return res.status === 204 ? undefined : res.json();
}

// ---- 一覧取得: GET /content ----
export async function fetchPages(): Promise<Page[]> {
  return z.array(contentSchema).parse(await request("GET", "/content"));
}

// ---- 作成: POST /content ----
export async function createPage(): Promise<Page> {
  return contentSchema.parse(await request("POST", "/content", {}));
}

// ---- 更新: PUT /content/:id ----
export async function updatePage(
  id: number,
  patch: { title?: string; body?: string },
): Promise<Page> {
  return contentSchema.parse(await request("PUT", `/content/${id}`, patch));
}

// ---- 削除: DELETE /content/:id ----
export async function deletePage(id: number): Promise<void> {
  await request("DELETE", `/content/${id}`);
}
