// 判定と保存で値がずれると、前後の空白の分だけ上限を超えた値が保存できてしまうため、そこを固定する。
import { act, renderHook } from "@testing-library/react";

import { useEditSection } from "./useEditSection";

describe("useEditSection", () => {
  it("保存する値は trim 済み（文字数の判定に使った値と同じものを送る）", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEditSection("  前後に空白  ", onSave));

    act(() => result.current.start());
    await act(() => result.current.save());

    expect(onSave).toHaveBeenCalledWith("前後に空白");
    expect(result.current.editing).toBe(false);
  });

  it("文字数は trim してから数える（空白だけの入力は 0 文字）", () => {
    const { result } = renderHook(() => useEditSection("   ", vi.fn()));

    expect(result.current.length).toBe(0);
  });

  it("保存に失敗したら編集状態のまま下書きを残す", async () => {
    const onSave = vi.fn().mockRejectedValue(new Error("保存に失敗"));
    const { result } = renderHook(() => useEditSection("元の値", onSave));

    act(() => result.current.start());
    act(() => result.current.setDraft("新しい値"));
    await act(() => result.current.save());

    expect(result.current.editing).toBe(true);
    expect(result.current.draft).toBe("新しい値");
  });
});
