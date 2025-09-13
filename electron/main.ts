import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// IPC handlers for file operations
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(win!, {
    properties: ['openFile'],
    filters: [
      { name: 'Excalidraw Files', extensions: ['excalidraw'] },
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  
  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const filePath = result.filePaths[0]
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const parsedData = JSON.parse(fileContent)
      
      // 基本验证文件结构
      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('无效的文件格式：文件内容不是有效的对象')
      }
      
      // 确保基本结构存在
      const validatedData = {
        elements: Array.isArray(parsedData.elements) ? parsedData.elements : [],
        appState: parsedData.appState || {},
        files: parsedData.files || {}
      }
      
      return {
        success: true,
        data: validatedData,
        filePath
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return { success: false, error: 'No file selected' }
})

ipcMain.handle('save-file-dialog', async (_, data) => {
  const result = await dialog.showSaveDialog(win!, {
    defaultPath: 'drawing.excalidraw',
    filters: [
      { name: 'Excalidraw Files', extensions: ['excalidraw'] },
      { name: 'JSON Files', extensions: ['json'] }
    ]
  })
  
  if (!result.canceled && result.filePath) {
    try {
      await fs.writeFile(result.filePath, JSON.stringify(data, null, 2))
      return {
        success: true,
        filePath: result.filePath
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return { success: false, error: 'Save cancelled' }
})

// 保存 PNG 图片
ipcMain.handle('save-png-dialog', async (_, buffer: Uint8Array) => {
  const result = await dialog.showSaveDialog(win!, {
    defaultPath: 'drawing.png',
    filters: [
      { name: 'PNG Images', extensions: ['png'] }
    ]
  })
  
  if (!result.canceled && result.filePath) {
    try {
      // 将 Uint8Array 转换为 Buffer
      const nodeBuffer = Buffer.from(buffer)
      await fs.writeFile(result.filePath, nodeBuffer)
      return {
        success: true,
        filePath: result.filePath
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return { success: false, error: 'Save cancelled' }
})

// 保存 SVG 文件
ipcMain.handle('save-svg-dialog', async (_, svgString) => {
  const result = await dialog.showSaveDialog(win!, {
    defaultPath: 'drawing.svg',
    filters: [
      { name: 'SVG Images', extensions: ['svg'] }
    ]
  })
  
  if (!result.canceled && result.filePath) {
    try {
      await fs.writeFile(result.filePath, svgString)
      return {
        success: true,
        filePath: result.filePath
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return { success: false, error: 'Save cancelled' }
})
