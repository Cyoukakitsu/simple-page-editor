---
name: sync-harness
description: ハーネス文書（CLAUDE.md / CONTEXT.md / INTERACTION.md / QUALITY_SCORE.md / README.md）を現在のコードと突き合わせ、食い違いを一覧にする。PR を出す前に使う。
disable-model-invocation: true
---

# sync-harness

1. **集める**: `git diff --name-only $(git merge-base HEAD origin/main)` と未追跡ファイルから、このブランチの変更を把握する。対象の5文書を全文読む。
   完了条件: 5文書をすべて読み終え、変更ファイルの一覧がある。

2. **突き合わせる**: 文書の中で事実を述べている行を1つずつ、実際のコード・`package.json`・設定ファイル・バックエンド（`../recruit-frontend-backend`）で裏を取る。とくに次を見る:
   - 「予定」「未実装」「現状」など、時点に依存する記述
   - ファイルパス・コンポーネント名・コマンドが実在するか
   - README に途中経過や今後の予定が混ざっていないか（CLAUDE.md「README」節）
   - CLAUDE.md「現在の状況」の完了・次にやること・未決定が、今のブランチの状態と合っているか

   完了条件: 事実を述べている行のすべてについて、裏が取れたか、食い違いとして記録した。

3. **報告する**: 食い違いを文書ごとの表（行番号・現在の記述・実際・修正案）で出す。修正はユーザーが確認してから行う。食い違いが無ければ「食い違いなし」と書く。
