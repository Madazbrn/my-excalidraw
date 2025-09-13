import React from 'react';

interface WorkspaceDialogsProps {
  showDeleteConfirm: string | null;
  showKeyboardHelp: boolean;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
  onKeyboardHelpClose: () => void;
}

export const WorkspaceDialogs: React.FC<WorkspaceDialogsProps> = ({
  showDeleteConfirm,
  showKeyboardHelp,
  onDeleteConfirm,
  onDeleteCancel,
  onKeyboardHelpClose
}) => {
  return (
    <>
      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-content rounded-lg p-6 max-w-md w-full mx-4 theme-transition">
            <h3 className="text-lg font-medium mb-3 font-virgil" style={{ color: 'var(--color-text-primary)' }}>
              确认删除
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              确定要删除这个文件吗？此操作无法撤销。
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="btn-secondary px-4 py-2 text-sm font-normal rounded-md"
                onClick={onDeleteCancel}
              >
                取消
              </button>
              <button 
                className="px-4 py-2 text-white text-sm font-normal rounded-md transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-error)',
                  borderColor: 'var(--color-error)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error)'}
                onClick={() => showDeleteConfirm && onDeleteConfirm(showDeleteConfirm)}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 快捷键帮助对话框 */}
      {showKeyboardHelp && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-content rounded-lg p-6 max-w-md w-full mx-4 theme-transition">
            <h3 className="text-lg font-medium mb-4 font-virgil" style={{ color: 'var(--color-text-primary)' }}>
              键盘快捷键
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>新建绘图</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)'
                }}>Ctrl/Cmd + N</kbd>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>导入文件</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)'
                }}>Ctrl/Cmd + O</kbd>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>全选文件</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)'
                }}>Ctrl/Cmd + A</kbd>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>删除选中</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)'
                }}>Delete</kbd>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>重命名文件</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)'
                }}>F2</kbd>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>复制文件</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)'
                }}>Ctrl/Cmd + D</kbd>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>取消选择</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)'
                }}>Escape</kbd>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="btn-primary px-4 py-2 text-sm font-normal rounded-md"
                onClick={onKeyboardHelpClose}
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
