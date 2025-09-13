import React from 'react';
import { WorkspaceFile, WorkspaceConfig } from '../../services/WorkspaceService';
import { FileCard } from './FileCard';

interface FileGridProps {
  files: WorkspaceFile[];
  config: WorkspaceConfig | null;
  viewMode: 'grid' | 'list';
  selectedFiles: Set<string>;
  onSelectFile: (id: string, selected: boolean) => void;
  onSelectAll: () => void;
  onOpenFile: (file: WorkspaceFile) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicateFile: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
  onDeleteFile: (id: string) => void;
  onCreateNew: () => void;
  formatFileSize: (size: number) => string;
  formatDate: (timestamp: number) => string;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  config,
  viewMode,
  selectedFiles,
  onSelectFile,
  onSelectAll,
  onOpenFile,
  onToggleFavorite,
  onDuplicateFile,
  onRenameFile,
  onDeleteFile,
  onCreateNew,
  formatFileSize,
  formatDate
}) => {
  if (files.length === 0) {
    return (
      <div className="space-y-4">
        {/* 全选选项 - 空状态下不显示 */}
        
        {/* 空状态 */}
        <div 
          className="col-span-full text-center py-20 border-2 border-dashed rounded-lg theme-transition"
          style={{ 
            borderColor: 'var(--color-border-secondary)',
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div className="text-5xl mb-4 opacity-60">📝</div>
          <h3 className="text-lg font-medium mb-2 font-virgil" style={{ color: 'var(--color-text-primary)' }}>
            还没有文件
          </h3>
          <p className="text-sm mb-6 font-normal" style={{ color: 'var(--color-text-secondary)' }}>
            创建您的第一个绘图开始吧！
          </p>
          <button 
            className="btn-primary px-4 py-2 text-sm font-normal rounded-md"
            onClick={onCreateNew}
          >
            创建新绘图
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 全选选项 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="selectAll"
          checked={selectedFiles.size === files.length && files.length > 0}
          onChange={onSelectAll}
          className="w-4 h-4 rounded transition-colors"
          style={{ 
            borderColor: 'var(--color-border-primary)',
            backgroundColor: 'var(--color-surface-elevated)',
            accentColor: 'var(--color-excalidraw-purple)'
          }}
        />
        <label htmlFor="selectAll" className="text-sm cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
          全选 ({files.length} 个文件)
        </label>
      </div>

      {/* 文件网格/列表 */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        : "space-y-3"
      }>
        {files.map(file => (
          <FileCard
            key={file.id}
            file={file}
            isSelected={selectedFiles.has(file.id)}
            isFavorite={config?.favoriteFiles.includes(file.id) || false}
            viewMode={viewMode}
            onSelect={onSelectFile}
            onOpen={onOpenFile}
            onToggleFavorite={onToggleFavorite}
            onDuplicate={onDuplicateFile}
            onRename={onRenameFile}
            onDelete={onDeleteFile}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};
