import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { createPage, deletePage, fetchPages, updatePage } from "./pageApi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const content = {
  id: 1,
  title: "こころ",
  body: "親譲りの無鉄砲で小供の時から損ばかりしている。",
  createdAt: "2026-09-10T10:00:00.000Z",
};

describe("fetchPages", () => {
  it("title/body が null のページは空文字にそろえて返す", async () => {
    server.use(
      http.get(`${BASE_URL}/content`, () =>
        HttpResponse.json([content, { ...content, id: 2, title: null, body: null }]),
      ),
    );

    await expect(fetchPages()).resolves.toEqual([
      content,
      { ...content, id: 2, title: "", body: "" },
    ]);
  });

  it("エラーステータスならエラーにする", async () => {
    server.use(
      http.get(`${BASE_URL}/content`, () => new HttpResponse(null, { status: 500 })),
    );

    await expect(fetchPages()).rejects.toThrow("500");
  });
});

describe("createPage", () => {
  it("ボディなしで POST し、作成されたページを返す", async () => {
    let sentBody: string | undefined;
    server.use(
      http.post(`${BASE_URL}/content`, async ({ request }) => {
        sentBody = await request.text();
        return HttpResponse.json({ ...content, title: null, body: null }, { status: 201 });
      }),
    );

    await expect(createPage()).resolves.toEqual({ ...content, title: "", body: "" });
    expect(sentBody).toBe("");
  });
});

describe("updatePage", () => {
  it("渡したフィールドだけを PUT で送る", async () => {
    let sentBody: unknown;
    server.use(
      http.put(`${BASE_URL}/content/1`, async ({ request }) => {
        sentBody = await request.json();
        return HttpResponse.json({ ...content, title: "坊っちゃん" });
      }),
    );

    await expect(updatePage(1, { title: "坊っちゃん" })).resolves.toEqual({
      ...content,
      title: "坊っちゃん",
    });
    expect(sentBody).toEqual({ title: "坊っちゃん" });
  });

  it("存在しない id で 200 + null が返ってきたらエラーにする", async () => {
    server.use(
      http.put(`${BASE_URL}/content/999`, () => HttpResponse.json(null)),
    );

    await expect(updatePage(999, { title: "坊っちゃん" })).rejects.toThrow();
  });
});

describe("deletePage", () => {
  it("204 なら正常に終わる", async () => {
    server.use(
      http.delete(`${BASE_URL}/content/1`, () => new HttpResponse(null, { status: 204 })),
    );

    await expect(deletePage(1)).resolves.toBeUndefined();
  });
});
