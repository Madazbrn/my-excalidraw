import { exportToBlob, exportToSvg, exportToClipboard } from "@excalidraw/excalidraw";
import type { BinaryFiles, AppState } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { fileService, type FileResult } from "./FileService";

// 导出选项接口
export interface ExportOptions {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}

/**
 * 导出服务 - 单例模式
 * 处理所有导出相关的操作：PNG、SVG、剪贴板等
 */
export class ExportService {
  private static instance: ExportService;
  
  private constructor() {}
  
  /**
   * 获取单例实例
   */
  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * 导出为 PNG 文件
   */
  public async exportToPNG(options: ExportOptions): Promise<FileResult> {
    try {
      const { elements, appState, files } = options;
      
      const blob = await exportToBlob({
        elements,
        appState,
        files,
        mimeType: "image/png",
      });
      
      // 将 Blob 转换为 ArrayBuffer，然后转换为 Uint8Array
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      return await fileService.exportPNG(uint8Array);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PNG export failed'
      };
    }
  }

  /**
   * 导出为 SVG 文件
   */
  public async exportToSVG(options: ExportOptions): Promise<FileResult> {
    try {
      const { elements, appState, files } = options;
      
      const svg = await exportToSvg({
        elements,
        appState,
        files,
      });
      
      const svgString = new XMLSerializer().serializeToString(svg);
      return await fileService.exportSVG(svgString);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SVG export failed'
      };
    }
  }

  /**
   * 复制到剪贴板
   */
  public async copyToClipboard(options: ExportOptions, type: "png" | "svg" | "json" = "png"): Promise<FileResult> {
    try {
      const { elements, appState, files } = options;
      
      await exportToClipboard({
        elements,
        appState,
        files,
        type
      });
      
      return {
        success: true,
        data: `Copied as ${type.toUpperCase()} to clipboard`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Clipboard copy failed'
      };
    }
  }

  /**
   * 导出为 Canvas 元素
   */
  public async exportToCanvas(options: ExportOptions): Promise<HTMLCanvasElement | null> {
    try {
      const { elements, appState, files } = options;
      // TODO: 实现 Canvas 导出功能
      console.log('Canvas 导出功能待实现', { elements, appState, files });
      
      // 注意：这里需要从 @excalidraw/utils/export 导入 exportToCanvas
      // 但由于当前没有导入，我们先返回 null
      console.warn('exportToCanvas not implemented yet');
      return null;
    } catch (error) {
      console.error('Canvas export failed:', error);
      return null;
    }
  }

  /**
   * 批量导出多种格式
   */
  public async exportMultiple(
    options: ExportOptions, 
    formats: Array<'png' | 'svg' | 'clipboard'>
  ): Promise<Record<string, FileResult>> {
    const results: Record<string, FileResult> = {};
    
    for (const format of formats) {
      try {
        switch (format) {
          case 'png':
            results.png = await this.exportToPNG(options);
            break;
          case 'svg':
            results.svg = await this.exportToSVG(options);
            break;
          case 'clipboard':
            results.clipboard = await this.copyToClipboard(options);
            break;
        }
      } catch (error) {
        results[format] = {
          success: false,
          error: error instanceof Error ? error.message : `${format} export failed`
        };
      }
    }
    
    return results;
  }

  /**
   * 获取支持的导出格式
   */
  public getSupportedFormats(): string[] {
    return ['png', 'svg', 'clipboard', 'json'];
  }

  /**
   * 验证导出选项
   */
  public validateExportOptions(options: ExportOptions): boolean {
    return (
      options &&
      Array.isArray(options.elements) &&
      options.appState &&
      typeof options.appState === 'object' &&
      options.files &&
      typeof options.files === 'object'
    );
  }
}

// 导出单例实例
export const exportService = ExportService.getInstance();
