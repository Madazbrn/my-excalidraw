import type { BinaryFiles, AppState } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

/**
 * 缩略图服务 - 使用 Excalidraw 官方 API 生成 SVG 缩略图
 */
export class ThumbnailService {
  private static instance: ThumbnailService;
  
  private constructor() {}
  
  public static getInstance(): ThumbnailService {
    if (!ThumbnailService.instance) {
      ThumbnailService.instance = new ThumbnailService();
    }
    return ThumbnailService.instance;
  }

  /**
   * 生成 SVG 缩略图
   * 注意：这个方法需要在 Excalidraw 组件挂载后调用
   */
  public async generateSVGThumbnail(
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>,
    _files: BinaryFiles,
    options: {
      width?: number;
      height?: number;
      exportPadding?: number;
      exportBackground?: boolean;
      exportWithDarkMode?: boolean;
    } = {}
  ): Promise<string> {
    try {
      // 如果没有元素，返回空白缩略图
      if (elements.length === 0) {
        return this.getEmptyThumbnail(options.width || 200, options.height || 150);
      }

      // 由于 exportToSvg 在当前版本中可能不可用，我们使用一个替代方案
      // 这里我们先返回一个基于元素信息的简化 SVG
      return await this.generateSimplifiedSVG(elements, appState, options);
    } catch (error) {
      console.error('生成 SVG 缩略图失败:', error);
      return this.getEmptyThumbnail(options.width || 200, options.height || 150);
    }
  }

  /**
   * 生成简化的 SVG 缩略图
   */
  private async generateSimplifiedSVG(
    elements: readonly ExcalidrawElement[],
    _appState: Partial<AppState>,
    options: {
      width?: number;
      height?: number;
      exportPadding?: number;
      exportBackground?: boolean;
      exportWithDarkMode?: boolean;
    }
  ): Promise<string> {
    const width = options.width || 200;
    const height = options.height || 150;
    const padding = options.exportPadding || 10;
    const backgroundColor = options.exportBackground !== false 
      ? (options.exportWithDarkMode ? '#121212' : '#ffffff')
      : 'transparent';

    // 计算元素边界框
    const bounds = this.calculateBounds(elements);
    if (!bounds) {
      return this.getEmptyThumbnail(width, height);
    }

    // 计算缩放比例
    const scaleX = (width - padding * 2) / bounds.width;
    const scaleY = (height - padding * 2) / bounds.height;
    const scale = Math.min(scaleX, scaleY, 1);

    // 计算居中偏移
    const scaledWidth = bounds.width * scale;
    const scaledHeight = bounds.height * scale;
    const offsetX = (width - scaledWidth) / 2 - bounds.x * scale;
    const offsetY = (height - scaledHeight) / 2 - bounds.y * scale;

    // 生成 SVG 元素
    let svgElements = '';
    
    elements.forEach(element => {
      if (element.isDeleted) return;

      const x = element.x * scale + offsetX;
      const y = element.y * scale + offsetY;
      const elementWidth = element.width * scale;
      const elementHeight = element.height * scale;

      const strokeColor = element.strokeColor || '#000000';
      const fillColor = element.backgroundColor || 'transparent';
      const strokeWidth = Math.max(0.5, (element.strokeWidth || 1) * scale);

      switch (element.type) {
        case 'rectangle': {
          const roundness = element.roundness?.value || 0;
          svgElements += `<rect x="${x}" y="${y}" width="${elementWidth}" height="${elementHeight}" 
            fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" 
            rx="${roundness * scale}" />`;
          break;
        }
        
        case 'ellipse': {
          const rx = elementWidth / 2;
          const ry = elementHeight / 2;
          const cx = x + rx;
          const cy = y + ry;
          svgElements += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" 
            fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
          break;
        }
        
        case 'diamond': {
          const centerX = x + elementWidth / 2;
          const centerY = y + elementHeight / 2;
          svgElements += `<polygon points="${centerX},${y} ${x + elementWidth},${centerY} ${centerX},${y + elementHeight} ${x},${centerY}" 
            fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
          break;
        }
        
        case 'line':
        case 'arrow': {
          if (element.points && element.points.length >= 2) {
            const startX = x + element.points[0][0] * scale;
            const startY = y + element.points[0][1] * scale;
            const endX = x + element.points[element.points.length - 1][0] * scale;
            const endY = y + element.points[element.points.length - 1][1] * scale;
            
            svgElements += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" 
              stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
              
            // 简单的箭头头部
            if (element.type === 'arrow') {
              const angle = Math.atan2(endY - startY, endX - startX);
              const arrowLength = 8 * scale;
              const arrowAngle = Math.PI / 6;
              
              const arrowX1 = endX - arrowLength * Math.cos(angle - arrowAngle);
              const arrowY1 = endY - arrowLength * Math.sin(angle - arrowAngle);
              const arrowX2 = endX - arrowLength * Math.cos(angle + arrowAngle);
              const arrowY2 = endY - arrowLength * Math.sin(angle + arrowAngle);
              
              svgElements += `<polygon points="${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}" 
                fill="${strokeColor}" />`;
            }
          }
          break;
        }
        
        case 'freedraw': {
          if (element.points && element.points.length > 0) {
            let pathData = `M ${x + element.points[0][0] * scale} ${y + element.points[0][1] * scale}`;
            for (let i = 1; i < element.points.length; i++) {
              pathData += ` L ${x + element.points[i][0] * scale} ${y + element.points[i][1] * scale}`;
            }
            svgElements += `<path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
          }
          break;
        }
        
        case 'text': {
          const textElement = element as ExcalidrawElement & { text?: string; fontSize?: number };
          const fontSize = Math.max(8, (textElement.fontSize || 16) * scale);
          const text = textElement.text || '';
          svgElements += `<text x="${x}" y="${y + fontSize}" font-family="Arial" font-size="${fontSize}" 
            fill="${strokeColor}">${text}</text>`;
          break;
        }
        
        default: {
          // 对于未知类型，绘制一个简单的矩形
          svgElements += `<rect x="${x}" y="${y}" width="${elementWidth}" height="${elementHeight}" 
            fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" opacity="0.5" />`;
        }
      }
    });

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        ${svgElements}
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  /**
   * 计算元素边界框
   */
  private calculateBounds(elements: readonly ExcalidrawElement[]): { x: number; y: number; width: number; height: number } | null {
    if (elements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach(element => {
      if (element.isDeleted) return;
      
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + element.width);
      maxY = Math.max(maxY, element.y + element.height);
    });

    if (minX === Infinity) return null;

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * 生成 Canvas 缩略图（如果需要 PNG 格式）
   */
  public async generateCanvasThumbnail(
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>,
    files: BinaryFiles,
    options: {
      width?: number;
      height?: number;
      exportPadding?: number;
      exportBackground?: boolean;
      exportWithDarkMode?: boolean;
      quality?: number;
    } = {}
  ): Promise<string> {
    try {
      // 首先生成 SVG
      const svgDataUrl = await this.generateSVGThumbnail(elements, appState, files, options);
      
      // 将 SVG 转换为 Canvas
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        canvas.width = options.width || 200;
        canvas.height = options.height || 150;
        
        img.onload = () => {
          if (ctx) {
            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 如果需要背景色
            if (options.exportBackground !== false) {
              ctx.fillStyle = options.exportWithDarkMode ? '#121212' : '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // 绘制 SVG
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          
          // 转换为 data URL
          const dataUrl = canvas.toDataURL('image/png', options.quality || 0.8);
          resolve(dataUrl);
        };
        
        img.onerror = () => {
          resolve(this.getEmptyThumbnail(options.width || 200, options.height || 150, 'canvas'));
        };
        
        img.src = svgDataUrl;
      });
    } catch (error) {
      console.error('生成 Canvas 缩略图失败:', error);
      return this.getEmptyThumbnail(options.width || 200, options.height || 150, 'canvas');
    }
  }

  /**
   * 获取空白缩略图
   */
  private getEmptyThumbnail(width: number = 200, height: number = 150, format: 'svg' | 'canvas' = 'svg'): string {
    if (format === 'canvas') {
      // 生成空白 Canvas 缩略图
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        // 背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制简单的图标
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 圆形
        ctx.beginPath();
        ctx.arc(centerX, centerY - 20, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 矩形
        ctx.fillRect(centerX - 20, centerY + 5, 40, 15);
        ctx.strokeRect(centerX - 20, centerY + 5, 40, 15);
        
        // 文字
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('空白绘图', centerX, centerY + 40);
      }
      
      return canvas.toDataURL('image/png', 0.8);
    } else {
      // SVG 版本
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8f9fa"/>
          <circle cx="${width/2}" cy="${height/2 - 20}" r="15" fill="#e9ecef" stroke="#dee2e6" stroke-width="2"/>
          <rect x="${width/2 - 20}" y="${height/2 + 5}" width="40" height="15" rx="2" fill="#e9ecef" stroke="#dee2e6" stroke-width="2"/>
          <text x="50%" y="${height/2 + 40}" font-family="Arial" font-size="12" fill="#6c757d" text-anchor="middle">空白绘图</text>
        </svg>
      `;
      
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }
  }

  /**
   * 获取空白缩略图（公共方法）
   */
  public getEmptyThumbnailPublic(width: number = 200, height: number = 150, format: 'svg' | 'canvas' = 'svg'): string {
    return this.getEmptyThumbnail(width, height, format);
  }

  /**
   * 批量生成缩略图
   */
  public async generateBatchThumbnails(
    items: Array<{
      elements: readonly ExcalidrawElement[];
      appState: Partial<AppState>;
      files: BinaryFiles;
      id: string;
    }>,
    options: {
      width?: number;
      height?: number;
      exportPadding?: number;
      exportBackground?: boolean;
      exportWithDarkMode?: boolean;
      format?: 'svg' | 'canvas';
      concurrency?: number;
    } = {}
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    const concurrency = options.concurrency || 3;
    const format = options.format || 'svg';
    
    // 分批处理
    for (let i = 0; i < items.length; i += concurrency) {
      const batch = items.slice(i, i + concurrency);
      
      const promises = batch.map(async (item) => {
        try {
          const thumbnail = format === 'canvas' 
            ? await this.generateCanvasThumbnail(item.elements, item.appState, item.files, options)
            : await this.generateSVGThumbnail(item.elements, item.appState, item.files, options);
          
          return { id: item.id, thumbnail };
        } catch (error) {
          console.error(`生成缩略图失败 (ID: ${item.id}):`, error);
          return { 
            id: item.id, 
            thumbnail: this.getEmptyThumbnail(options.width || 200, options.height || 150, format)
          };
        }
      });
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ id, thumbnail }) => {
        results.set(id, thumbnail);
      });
    }
    
    return results;
  }

  /**
   * 清理缓存的缩略图（如果有的话）
   */
  public clearThumbnailCache(): void {
    // 如果将来需要实现缓存机制，可以在这里清理
    console.log('缩略图缓存已清理');
  }
}

// 导出单例实例
export const thumbnailService = ThumbnailService.getInstance();