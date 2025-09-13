export interface FileResult {
  success: boolean;
  data?: any;
  filePath?: string;
  error?: string;
}

declare global {
  interface Window {
    fileAPI: {
      openFile: () => Promise<FileResult>;
      saveFile: (data: any) => Promise<FileResult>;
      savePNG: (buffer: Uint8Array) => Promise<FileResult>;
      saveSVG: (svgString: string) => Promise<FileResult>;
    };
  }
}
