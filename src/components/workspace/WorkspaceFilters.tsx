import React from 'react';

interface WorkspaceFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  filterBy: 'all' | 'favorites' | 'recent';
  onFilterChange: (filter: 'all' | 'favorites' | 'recent') => void;
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'size' | 'elementCount';
  onSortChange: (sort: 'name' | 'createdAt' | 'updatedAt' | 'size' | 'elementCount') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: () => void;
  selectedFilesCount: number;
  totalFilesCount: number;
  onBatchAddToFavorites: () => void;
  onBatchDelete: () => void;
  onShowKeyboardHelp: () => void;
}

export const WorkspaceFilters: React.FC<WorkspaceFiltersProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  selectedFilesCount,
  totalFilesCount,
  onBatchAddToFavorites,
  onBatchDelete,
  onShowKeyboardHelp
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 max-w-80">
          <input
            type="text"
            placeholder="搜索文件..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-primary w-full px-3 py-2 text-sm rounded-md"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* 视图模式切换 */}
          <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid var(--color-border-primary)' }}>
            <button
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'text-white' 
                  : 'hover:bg-[var(--color-surface-hover)]'
              }`}
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--color-excalidraw-purple)' : 'var(--color-surface-elevated)',
                color: viewMode === 'grid' ? 'var(--color-text-inverse)' : 'var(--color-text-primary)'
              }}
              onClick={() => onViewModeChange('grid')}
            >
              🔳 网格
            </button>
            <button
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'text-white' 
                  : 'hover:bg-[var(--color-surface-hover)]'
              }`}
              style={{
                backgroundColor: viewMode === 'list' ? 'var(--color-excalidraw-purple)' : 'var(--color-surface-elevated)',
                color: viewMode === 'list' ? 'var(--color-text-inverse)' : 'var(--color-text-primary)'
              }}
              onClick={() => onViewModeChange('list')}
            >
              📋 列表
            </button>
          </div>
          
          <span className="text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>
            {totalFilesCount} 个文件
          </span>
          
          {/* 快捷键帮助按钮 */}
          <button
            onClick={onShowKeyboardHelp}
            className="btn-ghost px-3 py-2 text-sm rounded-md"
            title="查看快捷键"
          >
            ⌨️ 快捷键
          </button>
        </div>
      </div>

      {/* 过滤和排序选项 */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* 过滤选项 */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>过滤:</span>
          <select
            value={filterBy}
            onChange={(e) => onFilterChange(e.target.value as 'all' | 'favorites' | 'recent')}
            className="input-primary px-3 py-1.5 text-sm rounded-md"
          >
            <option value="all">全部文件</option>
            <option value="favorites">收藏文件</option>
            <option value="recent">最近文件</option>
          </select>
        </div>

        {/* 排序选项 */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>排序:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'createdAt' | 'updatedAt' | 'size' | 'elementCount')}
            className="input-primary px-3 py-1.5 text-sm rounded-md"
          >
            <option value="updatedAt">修改时间</option>
            <option value="createdAt">创建时间</option>
            <option value="name">文件名</option>
            <option value="size">文件大小</option>
            <option value="elementCount">元素数量</option>
          </select>
          <button
            onClick={onSortOrderChange}
            className="btn-secondary px-2 py-1.5 text-sm rounded-md"
            title={sortOrder === 'asc' ? '升序' : '降序'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* 批量操作 */}
        {selectedFilesCount > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>已选择 {selectedFilesCount} 个文件</span>
            <button
              onClick={onBatchAddToFavorites}
              className="px-3 py-1.5 text-sm text-white rounded-md transition-colors"
              style={{ backgroundColor: 'var(--color-warning)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-warning-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-warning)'}
            >
              ⭐ 收藏
            </button>
            <button
              onClick={onBatchDelete}
              className="px-3 py-1.5 text-sm text-white rounded-md transition-colors"
              style={{ backgroundColor: 'var(--color-error)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error)'}
            >
              🗑️ 删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
