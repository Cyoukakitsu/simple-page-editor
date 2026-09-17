// タイトル・本文に共通する「Edit → 編集 → Cancel/Save」の流れ。
// 同じ処理をセクションごとに書き分けると片方だけ直し忘れるので、保存値の trim も含めてここ1か所に置く。
import { useState } from "react";

export function useEditSection(
  value: string,
  onSave: (next: string) => Promise<unknown>,
) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  return {
    editing,
    draft,
    setDraft,
    // 文字数は trim() してから数える（空白だけの入力を下限未満として弾くため）
    length: draft.trim().length,
    // 表示中の値を下書きに写してから編集に入る
    start: () => {
      setDraft(value);
      setEditing(true);
    },
    cancel: () => setEditing(false),
    // 判定した値と保存する値をそろえる（ずれると前後の空白の分だけ上限を超えた値が保存できてしまう）
    save: async () => {
      // 失敗時は入力を失わないよう編集中のまま残す（エラー通知は queryClient 側）
      try {
        await onSave(draft.trim());
        setEditing(false);
      } catch {}
    },
  };
}
