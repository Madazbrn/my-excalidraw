// 扩展 Excalidraw 的 AppState 类型
declare module "@excalidraw/excalidraw/types" {
  interface AppState {
    lockedMultiSelections?: Record<string, unknown>;
  }
}

export {};
