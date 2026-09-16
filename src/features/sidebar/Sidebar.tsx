// 全ページの一覧表示・選択・列表編集モード（削除／New page）を担当するサイドバー。
import { useState } from "react";

import { Button } from "../../components/ui/Button";
import plusIconUrl from "../../../icon/+.svg";
import deleteIconUrl from "../../../icon/delete.svg";
import doneIconUrl from "../../../icon/done.svg";
import editIconUrl from "../../../icon/edit.svg";
import logoIconUrl from "../../../icon/logo.svg";

type Page = {
  id: number;
  title: string;
  createdAt: string;
};

type SidebarProps = {
  pages: Page[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
};

export function Sidebar({
  pages,
  selectedId,
  onSelect,
  onDelete,
  onCreate,
}: SidebarProps) {
  const [isListEditMode, setIsListEditMode] = useState(false);

  // 呼び出し側に任せずここでソートする
  const sortedPages = [...pages].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  const handleDelete = (id: number, title: string) => {
    const label = title === "" ? "無題" : title;
    if (window.confirm(`「${label}」を削除しますか？`)) {
      onDelete(id);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 pt-7.5 pb-5 pl-10">
        <img src={logoIconUrl} alt="" className="h-8 w-8" />
        <span className="text-title font-bold">ServiceName</span>
      </div>

      <ul className="flex-1 overflow-auto pl-10">
        {sortedPages.map((page) => {
          const isSelected = page.id === selectedId;
          const rowClasses = [
            "flex h-11 items-center pr-2.5",
            isSelected && "rounded bg-bg-canvas",
          ]
            .filter(Boolean)
            .join(" ");
          const isUntitled = page.title === "";
          const labelClasses = [
            "flex-1 pl-2.5 text-left",
            isUntitled && "italic",
            isSelected
              ? "text-text-focus font-bold"
              : isUntitled && "text-text-muted",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={page.id} className={rowClasses}>
              <button
                type="button"
                aria-current={isSelected ? "page" : undefined}
                className={labelClasses}
                onClick={() => onSelect(page.id)}
              >
                {page.title === "" ? "無題" : page.title}
              </button>
              {isListEditMode && (
                <button
                  type="button"
                  aria-label="削除"
                  onClick={() => handleDelete(page.id, page.title)}
                >
                  <img
                    src={deleteIconUrl}
                    alt=""
                    className="h-6 w-6 transition-[filter] hover:brightness-[0.86] active:brightness-[0.72]"
                  />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div
        className={`flex h-15 items-center bg-bg-canvas pr-2.5 ${
          isListEditMode ? "justify-between pl-10" : "justify-end"
        }`}
      >
        {isListEditMode ? (
          <>
            <Button
              variant="secondary"
              icon={<img src={plusIconUrl} alt="" className="h-6 w-6" />}
              onClick={onCreate}
            >
              New page
            </Button>
            <Button
              variant="primary"
              icon={<img src={doneIconUrl} alt="" className="h-6 w-6" />}
              onClick={() => setIsListEditMode(false)}
            >
              Done
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            icon={<img src={editIconUrl} alt="" className="h-6 w-6" />}
            onClick={() => setIsListEditMode(true)}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
