import type { BinaryFiles, AppState } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

// 文件元数据接口
export interface FileMetadata {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string; // base64 图片
  size: number; // 文件大小（字节）
  elementCount: number; // 元素数量
}

// 工作区文件接口
export interface WorkspaceFile extends FileMetadata {
  data: {
    elements: readonly ExcalidrawElement[];
    appState: AppState;
    files: BinaryFiles;
  };
}

// 工作区配置
export interface WorkspaceConfig {
  recentFiles: string[]; // 最近打开的文件ID列表
  favoriteFiles: string[]; // 收藏的文件ID列表
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'size';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}

/**
 * 工作区服务 - 管理本地文件存储和工作区状态
 */
export class WorkspaceService {
  private static instance: WorkspaceService;
  private readonly STORAGE_KEY = 'excalidraw-workspace';
  private readonly CONFIG_KEY = 'excalidraw-workspace-config';
  
  private constructor() {}
  
  public static getInstance(): WorkspaceService {
    if (!WorkspaceService.instance) {
      WorkspaceService.instance = new WorkspaceService();
    }
    return WorkspaceService.instance;
  }

  /**
   * 获取所有工作区文件
   */
  public async getAllFiles(): Promise<WorkspaceFile[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const files: WorkspaceFile[] = JSON.parse(stored);
      return files.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('获取工作区文件失败:', error);
      return [];
    }
  }

  /**
   * 保存文件到工作区
   */
  public async saveToWorkspace(
    name: string,
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
    id?: string
  ): Promise<string> {
    try {
      const allFiles = await this.getAllFiles();
      const now = Date.now();
      
      const fileId = id || this.generateId();
      const existingIndex = allFiles.findIndex(f => f.id === fileId);
      
      // 生成缩略图
      const thumbnail = await this.generateThumbnail(elements, appState);
      
      const fileData: WorkspaceFile = {
        id: fileId,
        name: name || `未命名绘图 ${new Date().toLocaleDateString()}`,
        createdAt: existingIndex >= 0 ? allFiles[existingIndex].createdAt : now,
        updatedAt: now,
        thumbnail,
        size: this.calculateSize(elements, appState, files),
        elementCount: elements.length,
        data: { elements, appState, files }
      };
      
      if (existingIndex >= 0) {
        allFiles[existingIndex] = fileData;
      } else {
        allFiles.push(fileData);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allFiles));
      
      // 更新最近文件列表
      await this.addToRecentFiles(fileId);
      
      return fileId;
    } catch (error) {
      console.error('保存到工作区失败:', error);
      throw error;
    }
  }

  /**
   * 从工作区加载文件
   */
  public async loadFromWorkspace(id: string): Promise<WorkspaceFile | null> {
    try {
      const allFiles = await this.getAllFiles();
      const file = allFiles.find(f => f.id === id);
      
      if (file) {
        await this.addToRecentFiles(id);
      }
      
      return file || null;
    } catch (error) {
      console.error('从工作区加载文件失败:', error);
      return null;
    }
  }

  /**
   * 删除工作区文件
   */
  public async deleteFromWorkspace(id: string): Promise<boolean> {
    try {
      const allFiles = await this.getAllFiles();
      const filteredFiles = allFiles.filter(f => f.id !== id);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredFiles));
      
      // 从最近文件和收藏中移除
      const config = await this.getConfig();
      config.recentFiles = config.recentFiles.filter(fid => fid !== id);
      config.favoriteFiles = config.favoriteFiles.filter(fid => fid !== id);
      await this.saveConfig(config);
      
      return true;
    } catch (error) {
      console.error('删除工作区文件失败:', error);
      return false;
    }
  }

  /**
   * 复制文件
   */
  public async duplicateFile(id: string): Promise<string | null> {
    try {
      const file = await this.loadFromWorkspace(id);
      if (!file) return null;
      
      const newName = `${file.name} - 副本`;
      return await this.saveToWorkspace(
        newName,
        file.data.elements,
        file.data.appState,
        file.data.files
      );
    } catch (error) {
      console.error('复制文件失败:', error);
      return null;
    }
  }

  /**
   * 重命名文件
   */
  public async renameFile(id: string, newName: string): Promise<boolean> {
    try {
      const allFiles = await this.getAllFiles();
      const fileIndex = allFiles.findIndex(f => f.id === id);
      
      if (fileIndex >= 0) {
        allFiles[fileIndex].name = newName;
        allFiles[fileIndex].updatedAt = Date.now();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allFiles));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('重命名文件失败:', error);
      return false;
    }
  }

  /**
   * 获取工作区配置
   */
  public async getConfig(): Promise<WorkspaceConfig> {
    try {
      const stored = localStorage.getItem(this.CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('获取工作区配置失败:', error);
    }
    
    // 默认配置
    return {
      recentFiles: [],
      favoriteFiles: [],
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      viewMode: 'grid'
    };
  }

  /**
   * 保存工作区配置
   */
  public async saveConfig(config: WorkspaceConfig): Promise<void> {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('保存工作区配置失败:', error);
    }
  }

  /**
   * 添加到最近文件
   */
  private async addToRecentFiles(id: string): Promise<void> {
    const config = await this.getConfig();
    config.recentFiles = [id, ...config.recentFiles.filter(fid => fid !== id)].slice(0, 10);
    await this.saveConfig(config);
  }

  /**
   * 切换收藏状态
   */
  public async toggleFavorite(id: string): Promise<boolean> {
    try {
      const config = await this.getConfig();
      const isFavorite = config.favoriteFiles.includes(id);
      
      if (isFavorite) {
        config.favoriteFiles = config.favoriteFiles.filter(fid => fid !== id);
      } else {
        config.favoriteFiles.push(id);
      }
      
      await this.saveConfig(config);
      return !isFavorite;
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      return false;
    }
  }

  /**
   * 生成文件ID
   */
  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 计算文件大小
   */
  private calculateSize(elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles): number {
    const data = { elements, appState, files };
    return new Blob([JSON.stringify(data)]).size;
  }

  /**
   * 生成缩略图
   */
  private async generateThumbnail(elements: readonly ExcalidrawElement[], appState: AppState): Promise<string> {
    // 这里可以实现真正的缩略图生成
    // 暂时返回一个占位符
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV4Y2FsaWRyYXc8L3RleHQ+PC9zdmc+';
  }

  /**
   * 清空工作区
   */
  public async clearWorkspace(): Promise<boolean> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.CONFIG_KEY);
      return true;
    } catch (error) {
      console.error('清空工作区失败:', error);
      return false;
    }
  }

  /**
   * 获取工作区统计信息
   */
  public async getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    recentCount: number;
    favoriteCount: number;
  }> {
    const files = await this.getAllFiles();
    const config = await this.getConfig();
    
    return {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      recentCount: config.recentFiles.length,
      favoriteCount: config.favoriteFiles.length
    };
  }
}

// 导出单例实例
export const workspaceService = WorkspaceService.getInstance();
