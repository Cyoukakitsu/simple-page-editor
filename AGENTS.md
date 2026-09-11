# AGENTS.md

このリポジトリで作業する AI エージェント（Claude Code 等）向けの開発規約。人間の開発者にも有効。

## このプロジェクトについて

NCDC のフロントエンド採用課題。対象の後端リポジトリ：[ncdcdev/recruit-frontend](https://github.com/ncdcdev/recruit-frontend)（NestJS + TypeORM/SQLite、`Content` エンティティに対する CRUD API）。

- 要件・デザイン仕様の原本は後端リポジトリの `doc/frontend-challenge.md` と `Design/DesignSpec/`
- ドメイン用語・確定済みの設計判断は **[CONTEXT.md](./CONTEXT.md)** を必ず参照する（術語表。実装詳細は書かない）
- 提出前の自己採点は **[QUALITY_SCORE.md](./QUALITY_SCORE.md)** を使う

## 技術スタック

- React 19 + TypeScript + Vite
- Tailwind CSS v4（`@tailwindcss/vite`、`tailwind.config.js` なし。デザイン仕様の色/フォント値はここに集約する）
- TanStack Query（サーバー状態）+ TanStack Router（ファイルベースルーティング、`src/routes/`）
- zod（API レスポンスの実行時検証。型だけで信用しない）
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
- 型はそれを生み出すモジュールに置く。`src/types/` のような型だけを集めたフォルダは作らない（誰が何のために定義したか分からなくなるため）

## 命名・ドメイン用語

- 後端のエンティティ名は `Content` だが、UI・ドメイン層のコードでは **`Page`** を使う（`PageList`、`PageEditor` のように）。`Content` という名前は `src/api/` の中だけに閉じ込める
- 詳細・理由は [CONTEXT.md](./CONTEXT.md) を参照

## コードコメントの言語

- ハンドで書くコメントは**日本語**で統一する（このプロジェクトの成果物が日本語話者向けのため）
- Vite/TanStack Router などツールが自動生成したファイル・コメント（英語）はそのまま変更しない

## テスト

- 課題要件で「有効なテストを 1 つ以上」が必須。`src/**/*.test.ts(x)` に配置
- UI コンポーネントのテストは実装が固まってから追加する（現時点では `src/api/` のデータ層のみテスト済み）

## Git

- 現在の作業ブランチ: `setup/scaffold-and-tech-stack`（`main` はまだ存在しない。このブランチが一段落してから作る）
- コミットは意味のある単位でまとめる。ユーザーから明示的に頼まれない限り commit や push は行わない
