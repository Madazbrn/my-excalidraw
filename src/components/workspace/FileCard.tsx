import React, { useRef } from "react";
import { WorkspaceFile } from "../../services/WorkspaceService";
import { EditableText, EditableTextRef } from "./EditableText";

interface FileCardProps {
  file: WorkspaceFile;
  isSelected: boolean;
  isFavorite: boolean;
  viewMode: "grid" | "list";
  onSelect: (id: string, selected: boolean) => void;
  onOpen: (file: WorkspaceFile) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  formatFileSize: (size: number) => string;
  formatDate: (timestamp: number) => string;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  isSelected,
  isFavorite,
  viewMode,
  onSelect,
  onOpen,
  onToggleFavorite,
  onDuplicate,
  onRename,
  onDelete,
  formatFileSize,
  formatDate,
}) => {
  const editableTextRef = useRef<EditableTextRef>(null);

  const handleRename = (newName: string) => {
    onRename(file.id, newName);
  };

  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    editableTextRef.current?.startEdit();
  };

  if (viewMode === "grid") {
    return (
      <div
        className={`card rounded-lg transition-all duration-100 relative bg-surface-elevated border ${
          isSelected
            ? "border-excalidraw-purple shadow-lg"
            : "border-border-primary"
        }`}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.classList.remove("border-border-primary");
            e.currentTarget.classList.add(
              "border-excalidraw-purple",
              "shadow-lg"
            );
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.classList.remove(
              "border-excalidraw-purple",
              "shadow-lg"
            );
            e.currentTarget.classList.add("border-border-primary");
          }
        }}
      >
        {/* 选择框 */}
        <div className="absolute top-3 left-3 z-20">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border-2 ${
              isSelected
                ? "bg-excalidraw-purple border-excalidraw-purple"
                : "bg-white/90 border-white/70"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(file.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded opacity-0 absolute cursor-pointer"
            />
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        {/* 缩略图 */}
        <div
          className="relative h-40 group cursor-pointer overflow-hidden bg-bg-secondary"
          onClick={() => onOpen(file)}
        >
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button className="px-4 py-2 bg-white/20 text-white text-sm rounded-md backdrop-blur-sm cursor-pointer">
              👁️ 打开
            </button>
          </div>
        </div>

        {/* 文件信息 */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <EditableText
              ref={editableTextRef}
              value={file.name}
              onSave={handleRename}
              className="text-base font-medium flex-1 truncate mr-3 font-virgil text-text-primary"
              maxLength={100}
            />
            <div className="flex items-center gap-1">
              <button
                className={`btn-ghost p-1.5 rounded text-sm ${
                  isFavorite ? "text-yellow-500" : ""
                }`}
                style={{
                  color: isFavorite ? "#f59e0b" : "var(--color-text-tertiary)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(file.id);
                }}
                title="收藏"
              >
                {isFavorite ? "⭐" : "☆"}
              </button>
              <div className="relative group">
                <button
                  className="btn-ghost p-1.5 rounded text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  ⋯
                </button>
                <div className="absolute pt-1 right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 theme-transition">
                  <div
                    className="rounded-lg shadow-lg py-1 min-w-28 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 theme-transition"
                    style={{
                      backgroundColor: "var(--color-surface-elevated)",
                      border: "1px solid var(--color-border-primary)",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  >
                    <button
                      className="w-full px-3 py-2 text-left text-sm transition-colors"
                      style={{ color: "var(--color-text-primary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-surface-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(file);
                      }}
                    >
                      👁️ 打开
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm transition-colors"
                      style={{ color: "var(--color-text-primary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-surface-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(file.id);
                      }}
                    >
                      📋 复制
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm transition-colors"
                      style={{ color: "var(--color-text-primary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-surface-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    onClick={handleStartRename}
                    >
                      ✏️ 重命名
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm transition-colors"
                      style={{ color: "var(--color-error)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-error)";
                        e.currentTarget.style.color =
                          "var(--color-text-inverse)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--color-error)";
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file.id);
                      }}
                    >
                      🗑️ 删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex justify-between text-xs mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <span>{file.elementCount} 个元素</span>
            <span>{formatFileSize(file.size)}</span>
          </div>

          <div
            className="text-xs space-y-1"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <div>创建: {formatDate(file.createdAt)}</div>
            <div>修改: {formatDate(file.updatedAt)}</div>
          </div>
        </div>
      </div>
    );
  }

  // 列表视图
  return (
    <div
      className={`card rounded-lg p-4 transition-all duration-100 ${
        isSelected ? "shadow-md" : ""
      }`}
      style={{
        borderColor: isSelected
          ? "var(--color-excalidraw-purple)"
          : "var(--color-border-primary)",
        boxShadow: isSelected ? "var(--shadow-md)" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "var(--color-excalidraw-purple)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "var(--color-border-primary)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        }
      }}
    >
      <div className="flex items-center gap-4">
        {/* 选择框 */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(file.id, e.target.checked)}
          className="w-4 h-4 rounded transition-colors"
          style={{
            borderColor: "var(--color-border-primary)",
            backgroundColor: "var(--color-surface-elevated)",
            accentColor: "var(--color-excalidraw-purple)",
          }}
        />

        {/* 缩略图 */}
        <div
          className="w-16 h-12 rounded cursor-pointer overflow-hidden flex-shrink-0"
          style={{ backgroundColor: "var(--color-bg-secondary)" }}
          onClick={() => onOpen(file)}
        >
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 文件信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <EditableText
              ref={editableTextRef}
              value={file.name}
              onSave={handleRename}
              className="text-base font-medium truncate font-virgil"
              style={{ color: "var(--color-text-primary)" }}
              maxLength={100}
            />
            <button
              className="text-sm"
              style={{
                color: isFavorite ? "#f59e0b" : "var(--color-text-tertiary)",
              }}
              onClick={() => onToggleFavorite(file.id)}
              title="收藏"
            >
              {isFavorite ? "⭐" : "☆"}
            </button>
          </div>
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <span>{file.elementCount} 个元素</span>
            <span>{formatFileSize(file.size)}</span>
            <span>修改: {formatDate(file.updatedAt)}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="btn-ghost p-2 rounded text-sm"
            onClick={() => onOpen(file)}
            title="打开"
          >
            👁️
          </button>
          <button
            className="btn-ghost p-2 rounded text-sm"
            onClick={() => onDuplicate(file.id)}
            title="复制"
          >
            📋
          </button>
          <button
            className="btn-ghost p-2 rounded text-sm"
            onClick={handleStartRename}
            title="重命名"
          >
            ✏️
          </button>
          <button
            className="p-2 rounded text-sm transition-colors"
            style={{ color: "var(--color-error)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => onDelete(file.id)}
            title="删除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
