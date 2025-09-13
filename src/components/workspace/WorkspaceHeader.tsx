import React from 'react';

interface WorkspaceHeaderProps {
  onCreateNew: () => void;
  onImportFile: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onCreateNew,
  onImportFile
}) => {
  return (
    <header className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-2xl font-medium mb-1 font-virgil" style={{ color: 'var(--color-text-primary)' }}>
          我的绘图工作区
        </h1>
        <p className="text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>
          管理您的所有 Excalidraw 文件
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          className="btn-primary px-4 py-2 text-sm font-normal rounded-md flex items-center gap-2"
          onClick={onCreateNew}
          title="快捷键: Ctrl/Cmd + N"
        >
          ✨ 新建绘图
        </button>
        <button 
          className="btn-secondary px-4 py-2 text-sm font-normal rounded-md flex items-center gap-2"
          onClick={onImportFile}
          title="快捷键: Ctrl/Cmd + O"
        >
          📁 导入文件
        </button>
      </div>
    </header>
  );
};
