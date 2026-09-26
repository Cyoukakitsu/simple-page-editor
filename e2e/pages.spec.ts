// INTERACTION.md の主要な状態遷移を、実バックエンドに対してブラウザで通しで確かめる。
// DB は開発用と共用なので、各テストは自分で作ったページを afterEach で必ず消す。
import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

const API = 'http://localhost:3000'

// このテストで作ったページの id。afterEach で消す
let createdIds: number[] = []

test.afterEach(async ({ request }) => {
  // 後端は存在しない id の DELETE に 500 を返すので、画面から消し済みのものは飛ばす
  const pages = (await (await request.get(`${API}/content`)).json()) as { id: number }[]
  const remaining = new Set(pages.map((p) => p.id))
  for (const id of createdIds) {
    if (remaining.has(id)) await request.delete(`${API}/content/${id}`)
  }
  createdIds = []
})

// ---- 準備用: 作成そのものを試さないテストは API で直接ページを作る ----
async function createPageViaApi(request: APIRequestContext, data: { title: string; body: string }) {
  const res = await request.post(`${API}/content`, { data })
  const { id } = (await res.json()) as { id: number }
  createdIds.push(id)
  return id
}

// 既存データと衝突しないタイトル
const uniqueTitle = () => `E2E-${Date.now()}`

// ---- 画面操作: UI から New page を押し、作られたページの id を返す ----
async function clickNewPage(page: Page) {
  const nav = page.getByRole('navigation', { name: 'ページ一覧' })
  await nav.getByRole('button', { name: 'Edit' }).click()
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url() === `${API}/content` && r.request().method() === 'POST'),
    nav.getByRole('button', { name: 'New page' }).click(),
  ])
  const { id } = (await res.json()) as { id: number }
  createdIds.push(id)
  return id
}

test('New page → タイトルを保存すると Sidebar の表示も変わる', async ({ page }) => {
  await page.goto('/')
  await clickNewPage(page)

  const title = uniqueTitle()
  const main = page.getByRole('main')
  // タイトル・本文の Edit のうち、先頭がタイトル側（デザイン上の並び順）
  await main.getByRole('button', { name: 'Edit' }).first().click()
  await main.getByLabel('タイトル').fill(title)
  await main.getByRole('button', { name: 'Save' }).click()

  const row = page.getByRole('navigation').getByRole('button', { name: title })
  await expect(row).toHaveAttribute('aria-current', 'page')
})

test('本文は trim 後 10 文字未満だと保存できない', async ({ page, request }) => {
  const title = uniqueTitle()
  await createPageViaApi(request, { title, body: '元の本文です。十文字以上。' })
  await page.goto('/')
  await page.getByRole('navigation').getByRole('button', { name: title }).click()

  const main = page.getByRole('main')
  // 先頭がタイトル側、末尾が本文側
  await main.getByRole('button', { name: 'Edit' }).last().click()
  const save = main.getByRole('button', { name: 'Save' })

  // 前後の空白は数えない: 9 文字扱い
  await main.getByLabel('本文').fill('   123456789   ')
  await expect(save).toBeDisabled()

  await main.getByLabel('本文').fill('1234567890')
  await expect(save).toBeEnabled()
  await save.click()
  await expect(main.getByText('1234567890')).toBeVisible()
})

test('確認ダイアログで OK すると削除され、空状態になる', async ({ page, request }) => {
  const title = uniqueTitle()
  await createPageViaApi(request, { title, body: '削除されるページの本文。' })
  await page.goto('/')

  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: title }).click()
  await nav.getByRole('button', { name: 'Edit' }).click()

  page.once('dialog', (dialog) => dialog.accept())
  await nav.getByRole('listitem').filter({ hasText: title }).getByRole('button', { name: '削除' }).click()

  await expect(nav.getByRole('button', { name: title })).toHaveCount(0)
  await expect(page.getByText('ページを選択してください')).toBeVisible()
})

test('New page のトーストから取り消すとページが消える', async ({ page, request }) => {
  await page.goto('/')
  const id = await clickNewPage(page)

  await page.getByRole('button', { name: '取り消す' }).click()

  await expect(page.getByText('ページを選択してください')).toBeVisible()
  const pages = (await (await request.get(`${API}/content`)).json()) as { id: number }[]
  expect(pages.map((p) => p.id)).not.toContain(id)
})

test.describe('狭い画面', () => {
  test.use({ viewport: { width: 390, height: 760 } })

  test('選択すると MainArea だけになり、「← 一覧へ」で戻れる', async ({ page, request }) => {
    const title = uniqueTitle()
    await createPageViaApi(request, { title, body: '狭い画面で確かめる本文。' })
    await page.goto('/')

    const nav = page.getByRole('navigation')
    await nav.getByRole('button', { name: title }).click()
    await expect(nav).toBeHidden()

    await page.getByRole('button', { name: '← 一覧へ' }).click()
    await expect(nav.getByRole('button', { name: title })).toBeVisible()
  })
})
