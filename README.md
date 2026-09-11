# NCDC 採用課題 フロントエンド

[recruit-frontend](https://github.com/ncdcdev/recruit-frontend)（バックエンド課題リポジトリ）に対する、フロントエンド実装です。

## セットアップ

### 1. バックエンドを起動する

```bash
git clone https://github.com/ncdcdev/recruit-frontend.git
cd recruit-frontend
npm install
cp ./data/bk-dev.sqlite ./data/dev.sqlite
npm run migration:run
npm run start
```

`http://localhost:3000` で API が起動します（`http://localhost:3000/api` に Swagger あり）。

### 2. フロントエンドを起動する

パッケージマネージャーは **pnpm** を使用しています。Node.js 16.13 以降なら `corepack enable` だけで別途インストール不要です。

```bash
corepack enable        # pnpm が未導入の場合のみ
pnpm install
cp .env.example .env   # 必要に応じて VITE_API_BASE_URL を変更
pnpm run dev
```

`http://localhost:5173` で確認できます。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `pnpm run dev` | 開発サーバー起動 |
| `pnpm run build` | 型チェック + 本番ビルド |
| `pnpm run typecheck` | 型チェックのみ |
| `pnpm run test` | テスト実行（Vitest） |
| `pnpm run test:watch` | テスト watch モード |
| `pnpm run lint` | Lint（oxlint） |

## 技術選定・設計方針

TODO: 実装が進んだ段階で、技術選定の理由・ドメインの考え方・追加実装した機能などをここに記載する。

## 追加実装（仕様に明記されていないが独自に追加した機能）

TODO
