// バックエンドの /content エンドポイントに対応する薄いラッパー（fetch + zod でレスポンスを実行時検証）。
// 後端の名前 Content はこのファイルの中だけで使い、外へは Page として出す（CONTEXT.md）。
import { z } from "zod";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// title/body は DB 上 nullable（content.entity.ts）。UI は空文字で「無題」を判定するので空文字にそろえる
const contentSchema = z.object({
  id: z.number(),
  title: z.string().nullish().transform((value) => value ?? ""),
  body: z.string().nullish().transform((value) => value ?? ""),
  createdAt: z.string(),
});

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

export async function fetchPages(): Promise<Page[]> {
  return z.array(contentSchema).parse(await request("GET", "/content"));
}

// ボディなしで送ると title/body とも null の新規ページが作られる
export async function createPage(): Promise<Page> {
  return contentSchema.parse(await request("POST", "/content"));
}

// 存在しない id でも後端は 400 ではなく 200 + null を返す（findOneBy の null を undefined と比較しているため）。
// null は contentSchema を通らないので、ここでエラーとして扱える
export async function updatePage(
  id: number,
  patch: { title?: string; body?: string },
): Promise<Page> {
  return contentSchema.parse(await request("PUT", `/content/${id}`, patch));
}

export async function deletePage(id: number): Promise<void> {
  await request("DELETE", `/content/${id}`);
}
