import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { workspaceService, type WorkspaceFile, type WorkspaceConfig } from '../services/WorkspaceService';
import { 
  WorkspaceHeader, 
  WorkspaceFilters, 
  FileGrid, 
  WorkspaceDialogs 
} from './workspace';

interface WorkspacePageProps {
  onOpenFile: (file: WorkspaceFile) => void;
  onCreateNew: () => void;
  onImportFile: () => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  onOpenFile,
  onCreateNew,
  onImportFile
}) => {
  // 状态管理
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [config, setConfig] = useState<WorkspaceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt' | 'size' | 'elementCount'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'recent'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // 工具函数
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  // 数据加载
  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const [workspaceFiles, workspaceConfig] = await Promise.all([
        workspaceService.getAllFiles(),
        workspaceService.getConfig()
      ]);
      setFiles(workspaceFiles);
      setConfig(workspaceConfig);
    } catch (error) {
      console.error('加载工作区失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  // 文件操作
  const handleDeleteFile = async (id: string) => {
    const success = await workspaceService.deleteFromWorkspace(id);
    if (success) {
      setFiles(files.filter(f => f.id !== id));
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
    setShowDeleteConfirm(null);
  };

  const handleToggleFavorite = async (id: string) => {
    if (!config) return;
    
    const isFavorite = config.favoriteFiles.includes(id);
    const newFavorites = isFavorite 
      ? config.favoriteFiles.filter(fid => fid !== id)
      : [...config.favoriteFiles, id];
    
    const newConfig = { ...config, favoriteFiles: newFavorites };
    await workspaceService.saveConfig(newConfig);
    setConfig(newConfig);
  };

  const handleDuplicateFile = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    
    try {
      const newId = await workspaceService.saveToWorkspace(
        `${file.name} 副本`,
        file.data.elements,
        file.data.appState,
        file.data.files
      );
      
      // 重新加载文件列表
      await loadWorkspace();
      console.log('文件复制成功:', newId);
    } catch (error) {
      console.error('复制文件失败:', error);
    }
  };

  const handleRenameFile = async (id: string, newName: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    
    try {
      await workspaceService.saveToWorkspace(
        newName,
        file.data.elements,
        file.data.appState,
        file.data.files,
        id
      );
      
      // 更新本地状态
      setFiles(files.map(f => f.id === id ? { ...f, name: newName } : f));
      console.log('文件重命名成功');
    } catch (error) {
      console.error('重命名文件失败:', error);
    }
  };

  // 选择操作
  const handleSelectFile = useCallback((id: string, selected: boolean) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  // 过滤和排序
  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];
    
    // 搜索过滤
    if (searchTerm) {
      result = result.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 类别过滤
    if (filterBy === 'favorites' && config) {
      result = result.filter(file => config.favoriteFiles.includes(file.id));
    } else if (filterBy === 'recent' && config) {
      const recentIds = config.recentFiles.slice(0, 10);
      result = result.filter(file => recentIds.includes(file.id));
    }
    
    // 排序
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'updatedAt':
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'elementCount':
          aValue = a.elementCount;
          bValue = b.elementCount;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [files, searchTerm, filterBy, sortBy, sortOrder, config]);

  const handleSelectAll = useCallback(() => {
    if (selectedFiles.size === filteredAndSortedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredAndSortedFiles.map(f => f.id)));
    }
  }, [selectedFiles.size, filteredAndSortedFiles]);

  // 批量操作
  const handleBatchDelete = useCallback(() => {
    if (selectedFiles.size === 0) return;
    
    const confirmMessage = `确定要删除 ${selectedFiles.size} 个文件吗？此操作无法撤销。`;
    if (confirm(confirmMessage)) {
      Promise.all(
        Array.from(selectedFiles).map(id => workspaceService.deleteFromWorkspace(id))
      ).then(() => {
        setFiles(files.filter(f => !selectedFiles.has(f.id)));
        setSelectedFiles(new Set());
      });
    }
  }, [selectedFiles, files]);

  const handleBatchAddToFavorites = useCallback(async () => {
    if (!config || selectedFiles.size === 0) return;
    
    const newFavorites = [...new Set([...config.favoriteFiles, ...selectedFiles])];
    const newConfig = { ...config, favoriteFiles: newFavorites };
    
    await workspaceService.saveConfig(newConfig);
    setConfig(newConfig);
    setSelectedFiles(new Set());
  }, [config, selectedFiles]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A - 全选
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
      // Delete - 删除选中文件
      if (e.key === 'Delete' && selectedFiles.size > 0) {
        e.preventDefault();
        handleBatchDelete();
      }
      // Ctrl/Cmd + N - 新建绘图
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onCreateNew();
      }
      // Ctrl/Cmd + O - 导入文件
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        onImportFile();
      }
      // Escape - 取消选择
      if (e.key === 'Escape') {
        setSelectedFiles(new Set());
        setShowDeleteConfirm(null);
      }
      // F2 - 重命名（如果只选中一个文件）
      if (e.key === 'F2' && selectedFiles.size === 1) {
        e.preventDefault();
        const fileId = Array.from(selectedFiles)[0];
        const file = files.find(f => f.id === fileId);
        if (file) {
          const newName = prompt('新文件名:', file.name);
          if (newName && newName !== file.name) {
            handleRenameFile(fileId, newName);
          }
        }
      }
      // Ctrl/Cmd + D - 复制选中文件
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedFiles.size === 1) {
        e.preventDefault();
        const fileId = Array.from(selectedFiles)[0];
        handleDuplicateFile(fileId);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedFiles, files, onCreateNew, onImportFile, handleBatchDelete, handleDuplicateFile, handleRenameFile, handleSelectAll]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen theme-transition" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="text-base font-normal" style={{ color: 'var(--color-text-secondary)' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-virgil theme-transition" style={{ 
      backgroundColor: 'var(--color-bg-primary)', 
      color: 'var(--color-text-primary)' 
    }}>
      {/* 头部 */}
      <WorkspaceHeader 
        onCreateNew={onCreateNew}
        onImportFile={onImportFile}
      />

      {/* 过滤器 */}
      <WorkspaceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        selectedFilesCount={selectedFiles.size}
        totalFilesCount={filteredAndSortedFiles.length}
        onBatchAddToFavorites={handleBatchAddToFavorites}
        onBatchDelete={handleBatchDelete}
        onShowKeyboardHelp={() => setShowKeyboardHelp(true)}
      />

      {/* 文件网格 */}
      <FileGrid
        files={filteredAndSortedFiles}
        config={config}
        viewMode={viewMode}
        selectedFiles={selectedFiles}
        onSelectFile={handleSelectFile}
        onSelectAll={handleSelectAll}
        onOpenFile={onOpenFile}
        onToggleFavorite={handleToggleFavorite}
        onDuplicateFile={handleDuplicateFile}
        onRenameFile={handleRenameFile}
        onDeleteFile={(id) => setShowDeleteConfirm(id)}
        onCreateNew={onCreateNew}
        formatFileSize={formatFileSize}
        formatDate={formatDate}
      />

      {/* 对话框 */}
      <WorkspaceDialogs
        showDeleteConfirm={showDeleteConfirm}
        showKeyboardHelp={showKeyboardHelp}
        onDeleteConfirm={handleDeleteFile}
        onDeleteCancel={() => setShowDeleteConfirm(null)}
        onKeyboardHelpClose={() => setShowKeyboardHelp(false)}
      />
    </div>
  );
};
