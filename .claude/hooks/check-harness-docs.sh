#!/usr/bin/env bash
# Stop hook: ブランチ上でコードを変えたのにハーネス文書を一つも変えていなければ、終了前に確認を促す
set -euo pipefail

input=$(cat)
# 促した結果として再度止まるときはブロックしない（無限ループ防止）
[ "$(jq -r '.stop_hook_active // false' <<<"$input")" = "true" ] && exit 0

cd "${CLAUDE_PROJECT_DIR:-.}"
base=$(git merge-base HEAD origin/main 2>/dev/null || git rev-parse HEAD)
changed=$({ git diff --name-only "$base"; git ls-files --others --exclude-standard; } | sort -u)

code=$(grep -E '^(src/|package\.json$|vite\.config\.ts$|\.oxlintrc\.json$|tsconfig)' <<<"$changed" || true)
[ -z "$code" ] && exit 0
# ponytail: ブランチ内で文書を一度でも変えていれば以降は通す。コミット単位で見たくなったら判定を細かくする
grep -qE '^(CLAUDE|CONTEXT|INTERACTION|QUALITY_SCORE|README)\.md$' <<<"$changed" && exit 0

# 同じ変更内容に対しては一度だけ促す（小さな修正で毎ターン止まらないように）
stamp="$(git rev-parse --git-dir)/harness-check-stamp"
hash=$({ echo "$code"; git diff "$base" -- $code; } | shasum | cut -d' ' -f1)
[ -f "$stamp" ] && [ "$(cat "$stamp")" = "$hash" ] && exit 0
echo "$hash" >"$stamp"

jq -n --arg files "$code" '{
  decision: "block",
  reason: ("コードに変更がありますが、ハーネス文書（CLAUDE.md / CONTEXT.md / INTERACTION.md / QUALITY_SCORE.md / README.md）は変更されていません。CLAUDE.md の「ハーネス文書の更新」の表に沿って反映が必要か確認し、必要なら更新してください。不要なら、その理由を一言添えて終えてください。\n\n変更されたコード:\n" + $files)
}'
