import type { BinaryFiles, AppState } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

// 文件操作结果接口
export interface FileResult {
  success: boolean;
  data?: any;
  filePath?: string;
  error?: string;
}

// Excalidraw 场景数据接口
export interface ExcalidrawSceneData {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}

// 保存的文件格式
export interface ExcalidrawFileFormat {
  type: "excalidraw";
  version: number;
  source: string;
  elements: readonly ExcalidrawElement[];
  appState: {
    gridSize: number;
    gridStep: number;
    gridModeEnabled: boolean;
    viewBackgroundColor: string;
    lockedMultiSelections: Record<string, any>;
  };
  files: BinaryFiles;
}

/**
 * 文件管理服务 - 单例模式
 * 处理所有与文件相关的操作：打开、保存、导出等
 */
export class FileService {
  private static instance: FileService;
  
  private constructor() {}
  
  /**
   * 获取单例实例
   */
  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  /**
   * 打开 Excalidraw 文件
   */
  public async openFile(): Promise<FileResult> {
    try {
      const result = await window.fileAPI.openFile();
      
      if (result.success && result.data) {
        // 修复 collaborators：确保它是 Map 对象
        const fixedData = {
          ...result.data,
          appState: {
            ...result.data.appState,
            collaborators: new Map() // Excalidraw 期望的是 Map<SocketId, Collaborator>
          }
        };
        
        return {
          success: true,
          data: fixedData,
          filePath: result.filePath
        };
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 保存 Excalidraw 文件
   */
  public async saveFile(sceneData: ExcalidrawSceneData): Promise<FileResult> {
    try {
      const { elements, appState, files } = sceneData;
      
      // 只保留必要的 appState 属性，与官网格式保持一致
      const minimalAppState = {
        gridSize: appState.gridSize || 20,
        gridStep: appState.gridStep || 5,
        gridModeEnabled: appState.gridModeEnabled || false,
        viewBackgroundColor: appState.viewBackgroundColor || "#ffffff",
        lockedMultiSelections: appState.lockedMultiSelections || {}
      };
      
      const fileData: ExcalidrawFileFormat = {
        type: "excalidraw",
        version: 2,
        source: "https://excalidraw.com",
        elements,
        appState: minimalAppState,
        files
      };

      return await window.fileAPI.saveFile(fileData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 导出 PNG 图片
   */
  public async exportPNG(imageData: Uint8Array): Promise<FileResult> {
    try {
      return await window.fileAPI.savePNG(imageData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 导出 SVG 图片
   */
  public async exportSVG(svgString: string): Promise<FileResult> {
    try {
      return await window.fileAPI.saveSVG(svgString);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 验证文件数据格式
   */
  public validateFileData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.elements) &&
      data.appState &&
      typeof data.appState === 'object'
    );
  }

  /**
   * 获取文件扩展名
   */
  public getFileExtension(filePath: string): string {
    return filePath.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * 检查是否为支持的文件格式
   */
  public isSupportedFormat(filePath: string): boolean {
    const supportedExtensions = ['excalidraw', 'json'];
    const extension = this.getFileExtension(filePath);
    return supportedExtensions.includes(extension);
  }
}

// 导出单例实例
export const fileService = FileService.getInstance();
