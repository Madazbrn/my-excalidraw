import React, { useState, useEffect } from 'react';
import { workspaceService, type WorkspaceFile, type WorkspaceConfig } from '../services/WorkspaceService';

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
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [config, setConfig] = useState<WorkspaceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadWorkspace();
  }, []);

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

  const handleDuplicateFile = async (id: string) => {
    const newId = await workspaceService.duplicateFile(id);
    if (newId) {
      await loadWorkspace();
    }
  };

  const handleToggleFavorite = async (id: string) => {
    await workspaceService.toggleFavorite(id);
    const newConfig = await workspaceService.getConfig();
    setConfig(newConfig);
  };

  const handleRenameFile = async (id: string, newName: string) => {
    const success = await workspaceService.renameFile(id, newName);
    if (success) {
      setFiles(files.map(f => f.id === id ? { ...f, name: newName } : f));
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="workspace-loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      {/* 头部工具栏 */}
      <header className="workspace-header">
        <div className="workspace-title">
          <h1>我的绘图工作区</h1>
          <p>管理您的所有 Excalidraw 文件</p>
        </div>
        
        <div className="workspace-actions">
          <button className="btn btn-primary" onClick={onCreateNew}>
            ✨ 新建绘图
          </button>
          <button className="btn btn-secondary" onClick={onImportFile}>
            📁 导入文件
          </button>
        </div>
      </header>

      {/* 搜索和过滤 */}
      <div className="workspace-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索文件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="view-controls">
          <span className="file-count">{filteredFiles.length} 个文件</span>
        </div>
      </div>

      {/* 文件网格 */}
      <div className="files-grid">
        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>还没有文件</h3>
            <p>创建您的第一个绘图开始吧！</p>
            <button className="btn btn-primary" onClick={onCreateNew}>
              创建新绘图
            </button>
          </div>
        ) : (
          filteredFiles.map(file => (
            <div key={file.id} className="file-card">
              {/* 缩略图 */}
              <div className="file-thumbnail" onClick={() => onOpenFile(file)}>
                <img src={file.thumbnail} alt={file.name} />
                <div className="file-overlay">
                  <button className="btn-icon">👁️ 打开</button>
                </div>
              </div>
              
              {/* 文件信息 */}
              <div className="file-info">
                <div className="file-header">
                  <h3 className="file-name" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="file-actions">
                    <button
                      className={`btn-icon ${config?.favoriteFiles.includes(file.id) ? 'favorited' : ''}`}
                      onClick={() => handleToggleFavorite(file.id)}
                      title="收藏"
                    >
                      {config?.favoriteFiles.includes(file.id) ? '⭐' : '☆'}
                    </button>
                    <div className="dropdown">
                      <button className="btn-icon">⋯</button>
                      <div className="dropdown-menu">
                        <button onClick={() => onOpenFile(file)}>打开</button>
                        <button onClick={() => handleDuplicateFile(file.id)}>复制</button>
                        <button onClick={() => {
                          const newName = prompt('新文件名:', file.name);
                          if (newName && newName !== file.name) {
                            handleRenameFile(file.id, newName);
                          }
                        }}>重命名</button>
                        <button 
                          className="danger"
                          onClick={() => setShowDeleteConfirm(file.id)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="file-meta">
                  <span className="file-elements">{file.elementCount} 个元素</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                
                <div className="file-dates">
                  <div className="file-date">
                    创建: {formatDate(file.createdAt)}
                  </div>
                  <div className="file-date">
                    修改: {formatDate(file.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>确认删除</h3>
            <p>确定要删除这个文件吗？此操作无法撤销。</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                取消
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteFile(showDeleteConfirm)}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
