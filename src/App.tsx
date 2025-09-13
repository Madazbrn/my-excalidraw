import { useState, useEffect, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { fileService, workspaceService, type WorkspaceFile } from "./services";
import { WorkspacePage } from "./components/WorkspacePage";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./types/electron.d.ts";
import "./types/excalidraw-augmentation.d.ts";

function AppContent() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [currentView, setCurrentView] = useState<'workspace' | 'drawing'>('workspace');
  const [currentFile, setCurrentFile] = useState<WorkspaceFile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialData, setInitialData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // 通用的获取场景数据函数
  const getSceneData = useCallback(() => {
    if (!excalidrawAPI) {
      throw new Error('Excalidraw API 未准备好');
    }
    return {
      elements: excalidrawAPI.getSceneElements(),
      appState: excalidrawAPI.getAppState(),
      files: excalidrawAPI.getFiles()
    };
  }, [excalidrawAPI]);


  // 保存到工作区
  const handleSaveToWorkspace = useCallback(async () => {
    try {
      setIsSaving(true);
      const sceneData = getSceneData();
      const fileName = currentFile?.name || `绘图 ${new Date().toLocaleDateString()}`;
      
      console.log('保存场景数据:', {
        elementsCount: sceneData.elements.length,
        appState: sceneData.appState,
        filesCount: Object.keys(sceneData.files).length
      });
      
      const fileId = await workspaceService.saveToWorkspace(
        fileName,
        sceneData.elements,
        sceneData.appState,
        sceneData.files,
        currentFile?.id
      );
      
      setLastSaved(new Date());
      console.log('保存到工作区成功:', fileId);
      
      // 如果是新文件，更新当前文件信息
      if (!currentFile) {
        const savedFile = await workspaceService.loadFromWorkspace(fileId);
        console.log('加载保存的文件验证:', savedFile?.data.elements.length, '个元素');
        setCurrentFile(savedFile);
      }
    } catch (error) {
      console.error('保存到工作区时出错:', error);
    } finally {
      setIsSaving(false);
    }
  }, [getSceneData, currentFile]);

  // 保存并返回工作区
  const handleBackToWorkspaceWithSave = useCallback(async () => {
    try {
      // 如果有内容，先保存
      if (excalidrawAPI) {
        const sceneData = getSceneData();
        // 只有当画布上有内容时才保存
        if (sceneData.elements.length > 0) {
          await handleSaveToWorkspace();
        }
      }
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      // 无论保存是否成功都返回工作区
      setCurrentView('workspace');
    }
  }, [excalidrawAPI, getSceneData, handleSaveToWorkspace]);

  // 自动保存函数
  const autoSave = useCallback(async () => {
    if (!excalidrawAPI || !currentFile || currentView !== 'drawing') return;
    
    await handleSaveToWorkspace();
  }, [excalidrawAPI, currentFile, currentView, handleSaveToWorkspace]);

  // 设置自动保存定时器
  useEffect(() => {
    if (currentView === 'drawing' && currentFile) {
      const interval = setInterval(autoSave, 30000); // 每30秒自动保存
      return () => clearInterval(interval);
    }
  }, [currentView, currentFile, autoSave]);

  // 绘图页面的键盘快捷键
  useEffect(() => {
    if (currentView !== 'drawing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Q 或 Cmd+Q: 保存并返回工作区
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        handleBackToWorkspaceWithSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, handleBackToWorkspaceWithSave]);

  // 验证文件加载
  useEffect(() => {
    if (excalidrawAPI && initialData && currentFile) {
      // 延迟验证，确保 Excalidraw 已经处理了 initialData
      const timer = setTimeout(() => {
        const currentElements = excalidrawAPI.getSceneElements();
        console.log('✅ 验证文件加载:');
        console.log('- 预期元素数量:', initialData.elements?.length || 0);
        console.log('- 实际元素数量:', currentElements.length);
        
        if (currentElements.length === 0 && initialData.elements?.length > 0) {
          console.error('❌ 文件加载失败！尝试手动更新场景...');
          // 作为备用方案，尝试手动更新
          excalidrawAPI.updateScene({
            elements: initialData.elements,
            appState: initialData.appState,
          });
        } else {
          console.log('✅ 文件加载成功！');
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [excalidrawAPI, initialData, currentFile]);

  // 从工作区打开文件
  const handleOpenFromWorkspace = (file: WorkspaceFile) => {
    console.log('正在打开文件:', file.name, '元素数量:', file.data.elements.length);
    console.log('文件数据:', file.data);
    
    // 清理 appState，只保留必要的属性
    const cleanAppState = {
      viewBackgroundColor: file.data.appState.viewBackgroundColor || "#ffffff",
      gridSize: file.data.appState.gridSize || 20,
      gridStep: file.data.appState.gridStep || 5,
      gridModeEnabled: file.data.appState.gridModeEnabled || false,
      zoom: file.data.appState.zoom || { value: 1 },
      scrollX: file.data.appState.scrollX || 0,
      scrollY: file.data.appState.scrollY || 0,
    };
    
    // 准备初始数据
    const fileInitialData = {
      elements: file.data.elements,
      appState: cleanAppState,
      files: file.data.files || {},
    };
    
    console.log('设置初始数据:', fileInitialData);
    
    // 设置初始数据和文件信息
    setInitialData(fileInitialData);
    setCurrentFile(file);
    setCurrentView('drawing');
  };

  // 创建新绘图
  const handleCreateNew = () => {
    setCurrentFile(null);
    setInitialData(null); // 清空初始数据，让 Excalidraw 使用默认空白画布
    setCurrentView('drawing');
  };

  // 导入文件到工作区
  const handleImportToWorkspace = async () => {
    try {
      const result = await fileService.openFile();
      if (result.success && result.data) {
        // 保存到工作区
        const fileName = result.filePath ? 
          result.filePath.split('/').pop()?.replace('.excalidraw', '') || '导入的文件' :
          '导入的文件';
          
        await workspaceService.saveToWorkspace(
          fileName,
          result.data.elements,
          result.data.appState,
          result.data.files
        );
        
        console.log('文件导入到工作区成功');
      }
    } catch (error) {
      console.error('导入文件到工作区时出错:', error);
    }
  };


  // 根据当前视图渲染不同内容
  if (currentView === 'workspace') {
    return (
      <WorkspacePage
        onOpenFile={handleOpenFromWorkspace}
        onCreateNew={handleCreateNew}
        onImportFile={handleImportToWorkspace}
      />
    );
  }

  return (
    <div className="w-screen h-screen">
      {/* 返回工作区按钮 */}
      <div className="absolute top-4 left-16 z-[999]">
        <button
          onClick={handleBackToWorkspaceWithSave}
          disabled={isSaving}
          className={`
            px-4 py-[9px] text-sm rounded-lg backdrop-blur-sm transition-all duration-200
            flex items-center gap-2 font-medium cursor-pointer border border-transparent active:border-black
            ${
              isSaving
                ? "bg-gray-400/90 text-white cursor-not-allowed"
                : "bg-[#ececf4]/90 text-gray-700"
            }
          `}
          title={isSaving ? "正在保存..." : "保存并返回工作区 (Ctrl+Q)"}
        >
          {isSaving ? (
            <>
              <span className="animate-spin">💾</span>
              <span>保存中...</span>
            </>
          ) : (
            <>
              <span>←</span>
              <span>返回工作区</span>
            </>
          )}
        </button>
      </div>

      {/* 当前文件信息和保存状态 */}
      {currentFile && (
        <div className="absolute bottom-[16px] right-[66px] z-[999] bg-white/95 text-sm text-gray-600 backdrop-blur-sm opacity-70">
          <div className="flex items-center gap-2">
            <span>📝 {currentFile.name}</span>
            {isSaving && (
              <span className="text-blue-600 animate-pulse">💾</span>
            )}
            {lastSaved && !isSaving && (
              <span className="text-green-600 text-xs">
                已保存 {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}

      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={initialData}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
