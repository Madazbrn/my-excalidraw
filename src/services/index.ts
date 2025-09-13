// 服务层统一导出
export { FileService, fileService } from './FileService';
export { ExportService, exportService } from './ExportService';
export { WorkspaceService, workspaceService } from './WorkspaceService';
export { ThumbnailService, thumbnailService } from './ThumbnailService';

// 导出类型
export type { 
  FileResult, 
  ExcalidrawSceneData, 
  ExcalidrawFileFormat 
} from './FileService';

export type { 
  ExportOptions 
} from './ExportService';

export type {
  FileMetadata,
  WorkspaceFile,
  WorkspaceConfig
} from './WorkspaceService';
