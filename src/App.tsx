import { useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { fileService, exportService } from "./services";
import "./types/electron.d.ts";
import "./types/excalidraw-augmentation.d.ts";

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  // 通用的获取场景数据函数
  const getSceneData = () => {
    if (!excalidrawAPI) {
      throw new Error('Excalidraw API 未准备好');
    }
    return {
      elements: excalidrawAPI.getSceneElements(),
      appState: excalidrawAPI.getAppState(),
      files: excalidrawAPI.getFiles()
    };
  };

  const handleOpenFile = async () => {
    try {
      const result = await fileService.openFile();
      if (result.success && result.data && excalidrawAPI) {
        excalidrawAPI.updateScene(result.data);
        console.log('文件打开成功:', result.filePath);
      } else {
        console.error('打开文件失败:', result.error);
      }
    } catch (error) {
      console.error('打开文件时出错:', error);
    }
  };

  const handleSaveFile = async () => {
    try {
      const sceneData = getSceneData();
      const result = await fileService.saveFile(sceneData);
      
      if (result.success) {
        console.log('文件保存成功:', result.filePath);
      } else {
        console.error('保存文件失败:', result.error);
      }
    } catch (error) {
      console.error('保存文件时出错:', error);
    }
  };

  const handleExportPNG = async () => {
    try {
      const exportOptions = getSceneData();
      const result = await exportService.exportToPNG(exportOptions);
      
      if (result.success) {
        console.log('PNG 导出成功:', result.filePath);
      } else {
        console.error('PNG 导出失败:', result.error);
      }
    } catch (error) {
      console.error('PNG 导出时出错:', error);
    }
  };

  const handleExportSVG = async () => {
    try {
      const exportOptions = getSceneData();
      const result = await exportService.exportToSVG(exportOptions);
      
      if (result.success) {
        console.log('SVG 导出成功:', result.filePath);
      } else {
        console.error('SVG 导出失败:', result.error);
      }
    } catch (error) {
      console.error('SVG 导出时出错:', error);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const exportOptions = getSceneData();
      const result = await exportService.copyToClipboard(exportOptions, "png");
      
      if (result.success) {
        console.log('已复制到剪贴板');
      } else {
        console.error('复制到剪贴板失败:', result.error);
      }
    } catch (error) {
      console.error('复制到剪贴板时出错:', error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* 工具栏 */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 999,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        maxWidth: "600px"
      }}>
        <button
          onClick={handleOpenFile}
          style={{
            padding: "8px 16px",
            border: "1px solid #0066cc",
            borderRadius: "4px",
            backgroundColor: "#0066cc",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          📂 打开文件
        </button>
        <button
          onClick={handleSaveFile}
          style={{
            padding: "8px 16px",
            border: "1px solid #28a745",
            borderRadius: "4px",
            backgroundColor: "#28a745",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          💾 保存 .excalidraw
        </button>
        <button
          onClick={handleExportPNG}
          style={{
            padding: "8px 16px",
            border: "1px solid #17a2b8",
            borderRadius: "4px",
            backgroundColor: "#17a2b8",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          🖼️ 导出 PNG
        </button>
        <button
          onClick={handleExportSVG}
          style={{
            padding: "8px 16px",
            border: "1px solid #fd7e14",
            borderRadius: "4px",
            backgroundColor: "#fd7e14",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          📐 导出 SVG
        </button>
        <button
          onClick={handleCopyToClipboard}
          style={{
            padding: "8px 16px",
            border: "1px solid #6f42c1",
            borderRadius: "4px",
            backgroundColor: "#6f42c1",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          📋 复制到剪贴板
        </button>
      </div>

      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
      />
    </div>
  );
}
