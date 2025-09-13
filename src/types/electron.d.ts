export interface FileResult {
  success: boolean;
  data?: unknown;
  filePath?: string;
  error?: string;
}

declare global {
  interface Window {
    fileAPI: {
      openFile: () => Promise<FileResult>;
      saveFile: (data: unknown) => Promise<FileResult>;
      savePNG: (buffer: Uint8Array) => Promise<FileResult>;
      saveSVG: (svgString: string) => Promise<FileResult>;
    };
  }
}
