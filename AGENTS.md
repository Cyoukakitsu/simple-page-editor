# AGENTS.md

このリポジトリで作業する AI エージェント（Claude Code 等）向けの開発規約。人間の開発者にも有効。

## このプロジェクトについて

NCDC のフロントエンド採用課題。対象の後端リポジトリ：[ncdcdev/recruit-frontend](https://github.com/ncdcdev/recruit-frontend)（NestJS + TypeORM/SQLite、`Content` エンティティに対する CRUD API）。

- 要件・デザイン仕様の原本は後端リポジトリの `doc/frontend-challenge.md` と `Design/DesignSpec/`
- **デザインの寸法はスクショを目視せず `Design/DesignSpec/index.html` から取る**。このファイルには Sketch が書き出した JSON（`let data = {...}`）が埋め込まれていて、全レイヤーの `rect`（x/y/width/height）が入っている。ボタン幅やパディングを目測で実装すると高確率でズレる
- ドメイン用語・確定済みの設計判断は **[CONTEXT.md](./CONTEXT.md)** を必ず参照する（術語表。実装詳細は書かない）
- Sidebar・MainArea の画面状態遷移とイベントは **[INTERACTION.md](./INTERACTION.md)** を必ず参照する（`Design/画面/20220615/` の4枚のモックアップを言語化したもの）
- 提出前の自己採点は **[QUALITY_SCORE.md](./QUALITY_SCORE.md)** を使う

## 技術スタック

- React 19 + TypeScript + Vite
- Tailwind CSS v4（`@tailwindcss/vite`、`tailwind.config.js` なし。デザイン仕様の色/フォント値はここに集約する）
- TanStack Query（サーバー状態）
- ルーティングライブラリは使わない（画面が1つだけのため。TanStack Router を一度導入したが削除した）
- zod（API レスポンスの実行時検証。型だけで信用せず、`src/api/` で検証してから外に出す）
- Vitest + React Testing Library + MSW（テスト）
- sonner（トースト通知）
- 状態管理ライブラリ（Zustand 等）は意図的に不採用。TanStack Query でサーバー状態、ローカル UI 状態はコンポーネントの `useState` で十分という判断

## よく使うコマンド

パッケージマネージャーは **pnpm**（`corepack enable` で導入可能。npm には戻さない）。

```bash
pnpm run dev         # 開発サーバー
pnpm run typecheck   # 型チェックのみ
pnpm run test        # テスト一括実行
pnpm run test:watch  # テスト watch
pnpm run lint        # oxlint
pnpm run build       # typecheck + 本番ビルド
```

バックエンドはこのリポジトリの外（`../recruit-frontend-backend`）で別途 `npm run start`（port 3000）。`.env` の `VITE_API_BASE_URL` で向き先を変更できる。

## ディレクトリ構成の方針

- **feature ベースで分割**する。`components/` `hooks/` のような種類別の大部屋は作らない
- `src/api/` — バックエンドの各エンドポイントに対応する薄いラッパー（fetch + zod 検証）。TanStack Query の `queryFn`/`mutationFn` はここの関数を渡すだけにする
- `src/features/*` — 画面/機能単位のコンポーネントと、そのfeature専用の hooks
- `src/components/ui/` — 複数 feature から使う汎用コンポーネント（ボタン等）
- 画像リソースはリポジトリ直下の `icon/`（`Design/img/icon` と同じもの）を使い、Vite の URL import で読む（`import editIconUrl from "../../../icon/edit.svg"`）。`public/` は置いていない。SVG は塗り色が埋め込み済みなので `<img>` で貼るだけでよく、色を変えたい場合のみ CSS filter を使う（`Sidebar.tsx` の削除アイコン参照）
- 型はそれを生み出すモジュールに置く。`src/types/` のような型だけを集めたフォルダは作らない（誰が何のために定義したか分からなくなるため）

## 命名・ドメイン用語

- 後端のエンティティ名は `Content` だが、UI・ドメイン層のコードでは **`Page`** を使う（`PageEditor`、`Sidebar` の `Page` 型のように）。`Content` という名前は `src/api/` の中だけに閉じ込める
- 詳細・理由は [CONTEXT.md](./CONTEXT.md) を参照

## コードコメントの言語

- ハンドで書くコメントは**日本語**で統一する（このプロジェクトの成果物が日本語話者向けのため）
- Vite などツールが自動生成したファイル・コメント（英語）はそのまま変更しない

## テスト

- 課題要件で「有効なテストを 1 つ以上」が必須
- テストファイルはソースファイルと**同じディレクトリに co-locate** する（`Button.tsx` の隣に `Button.test.tsx`）。`__tests__/` のような鏡合わせのフォルダは作らない
- `src/test/setup.ts` は Vitest のグローバル設定ファイルであり、「テストを置く場所」ではない（名前が紛らわしいだけ）
- **現状のテスト方針**: 汎用 UI コンポーネント（`src/components/ui/`）は TDD で書く（`Button.test.tsx`）。`src/features/*` はデザイン追従のイテレーションを優先していて、現時点ではテストを置いていない（`Sidebar` は一度書いたものを意図的に削除した）。ロジックが入る `src/api/` は TDD で書き、MSW でバックエンドの応答を差し替えてテストする（`pageApi.test.ts`）

## 現在の状況（2026-09-15 時点）

- デザイントークン（配色・文字サイズ・ボタン状態色）は `src/index.css` に実装済み。design-5/6 の値は全て反映済みで、選択中メニューの文字色 `#32A8F8` だけは色板ではなく `01_default.png` の注釈が出典（`--color-text-focus`）
- `src/components/ui/Button.tsx` 実装済み（variant: primary/secondary/normal、width: wide 90px / square 40px、アイコン24px + ラベル10px の縦積み、TDD でテスト済み）
- `src/features/sidebar/Sidebar.tsx` 実装済み（一覧表示・選択・列表編集モードの削除／New page、確認ダイアログ付き）。**`createdAt` 降順のソートは呼び出し側ではなく Sidebar の内部で行う**（CONTEXT.md が並び順を Sidebar という用語の性質として定義しているため、呼び出し側が忘れられる形にしない）
- `src/features/page-editor/` 実装済み（`PageEditor` が組み立て、`TitleSection` / `BodySection` が各々独立した編集状態を持つ）
- 画面の切り替え: ページ選択は URL ではなくローカル state で行う。`src/App.tsx` が選択中なら `PageEditor`、未選択なら空状態を描画する
- レイアウトは 4枚のモックアップと DesignSpec の実測値に合わせ込み済み（左コンテンツ + 右 90px ボタン列の2カラム、カードは高さいっぱい）
- `src/api/pageApi.ts` 実装済み（`fetchPages` / `createPage` / `updatePage` / `deletePage`、zod 検証、MSW でテスト済み）。ただし UI からはまだ呼んでいない
- **UI は `src/App.tsx` 内の仮データ（`samplePages`）で動いている。次は TanStack Query の hooks を作り、この仮データを実 API に差し替える**（決定済み: 更新・作成・削除の成功後は invalidate で一覧を再取得、API エラーは sonner のトーストで通知）
- API 接続時に決めること: 初期表示でページを選択するか（現状は仮データの3件目を選択している）

## README

- 評価者が読む提出物。**実装済みの内容だけを書き**、進捗・今後の予定・途中経過は書かない（それらは PR の説明と、このファイルの「現在の状況」に書く）

## Git

- リモート: `origin` = https://github.com/Cyoukakitsu/simple-page-editor
- 作業ごとに最新の `main` からブランチを切り、PR でマージする。マージ済みのブランチに追加でコミットしない
- コミットは意味のある単位でまとめる。ユーザーから明示的に頼まれない限り commit や push は行わない
