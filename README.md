# My Excalidraw | 我的 Excalidraw

[English](#english) | [中文](#中文)

---

## English

A modern, feature-rich Excalidraw desktop application built with Electron, React, and TypeScript. This application provides a comprehensive workspace management system for your drawings with advanced features like file organization, theme switching, and seamless integration with the Excalidraw drawing engine.

### ✨ Features

#### 🎨 **Drawing Experience**
- Full Excalidraw integration with all native features
- Clean, distraction-free interface
- Auto-save functionality (every 30 seconds)
- Smart save-and-return workflow

#### 📁 **Workspace Management**
- Visual file browser with grid and list views
- Thumbnail previews for all drawings
- Advanced file operations (rename, duplicate, delete, favorite)
- Batch operations for multiple files
- Smart file organization with metadata

#### 🎯 **User Experience**
- **Inline Editing**: Click any filename to rename instantly
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + N`: New drawing
  - `Ctrl/Cmd + O`: Import file
  - `Ctrl/Cmd + Q`: Save and return to workspace
  - `Delete`: Delete selected files
  - `F2`: Rename selected file
- **Theme Support**: Light/Dark/System themes with smooth transitions
- **Responsive Design**: Adapts to different screen sizes

#### 🔧 **Technical Features**
- Built with modern web technologies
- TypeScript for type safety
- Modular component architecture
- Efficient file storage and retrieval
- Cross-platform compatibility (Windows, macOS, Linux)

### 🚀 Getting Started

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-excalidraw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### 🏗️ Architecture

#### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron
- **Styling**: Tailwind CSS with custom CSS variables
- **Drawing Engine**: @excalidraw/excalidraw
- **Build Tool**: Vite

#### Project Structure
```
src/
├── components/           # React components
│   ├── workspace/       # Workspace-related components
│   │   ├── FileCard.tsx      # Individual file display
│   │   ├── FileGrid.tsx      # File grid/list layout
│   │   ├── EditableText.tsx  # Inline text editing
│   │   └── ...
│   ├── ThemeToggle.tsx  # Theme switching
│   └── WorkspacePage.tsx # Main workspace
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Theme management
├── services/            # Business logic
│   ├── WorkspaceService.ts   # File management
│   ├── FileService.ts        # File I/O operations
│   ├── ExportService.ts      # Export functionality
│   └── ThumbnailService.ts   # Thumbnail generation
└── types/               # TypeScript definitions
```

### 🎨 Customization

#### Themes
The application supports custom themes through CSS variables. You can modify the theme colors in `src/index.css`:

```css
:root {
  --color-excalidraw-purple: #5f57ff;
  --color-bg-primary: #ffffff;
  --color-text-primary: #1e1e1e;
  /* ... more variables */
}
```

#### Components
All components are modular and can be easily customized or extended. The `EditableText` component, for example, can be reused throughout the application for any inline editing needs.

### 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 中文

一个现代化、功能丰富的 Excalidraw 桌面应用程序，基于 Electron、React 和 TypeScript 构建。该应用程序为您的绘图提供了全面的工作区管理系统，具有文件组织、主题切换和与 Excalidraw 绘图引擎无缝集成等高级功能。

### ✨ 功能特性

#### 🎨 **绘图体验**
- 完整的 Excalidraw 集成，支持所有原生功能
- 简洁、无干扰的界面设计
- 自动保存功能（每30秒）
- 智能的保存并返回工作流程

#### 📁 **工作区管理**
- 可视化文件浏览器，支持网格和列表视图
- 所有绘图的缩略图预览
- 高级文件操作（重命名、复制、删除、收藏）
- 多文件批量操作
- 带有元数据的智能文件组织

#### 🎯 **用户体验**
- **内联编辑**：点击任何文件名即可立即重命名
- **键盘快捷键**：
  - `Ctrl/Cmd + N`：新建绘图
  - `Ctrl/Cmd + O`：导入文件
  - `Ctrl/Cmd + Q`：保存并返回工作区
  - `Delete`：删除选中文件
  - `F2`：重命名选中文件
- **主题支持**：浅色/深色/系统主题，支持平滑过渡
- **响应式设计**：适应不同屏幕尺寸

#### 🔧 **技术特性**
- 使用现代 Web 技术构建
- TypeScript 提供类型安全
- 模块化组件架构
- 高效的文件存储和检索
- 跨平台兼容性（Windows、macOS、Linux）

### 🚀 快速开始

#### 环境要求
- Node.js（v16 或更高版本）
- npm 或 yarn

#### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd my-excalidraw
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

### 🏗️ 架构设计

#### 技术栈
- **前端**：React 18 + TypeScript
- **桌面端**：Electron
- **样式**：Tailwind CSS 配合自定义 CSS 变量
- **绘图引擎**：@excalidraw/excalidraw
- **构建工具**：Vite

#### 项目结构
```
src/
├── components/           # React 组件
│   ├── workspace/       # 工作区相关组件
│   │   ├── FileCard.tsx      # 单个文件显示
│   │   ├── FileGrid.tsx      # 文件网格/列表布局
│   │   ├── EditableText.tsx  # 内联文本编辑
│   │   └── ...
│   ├── ThemeToggle.tsx  # 主题切换
│   └── WorkspacePage.tsx # 主工作区
├── contexts/            # React 上下文
│   └── ThemeContext.tsx # 主题管理
├── services/            # 业务逻辑
│   ├── WorkspaceService.ts   # 文件管理
│   ├── FileService.ts        # 文件 I/O 操作
│   ├── ExportService.ts      # 导出功能
│   └── ThumbnailService.ts   # 缩略图生成
└── types/               # TypeScript 类型定义
```

### 🎨 自定义配置

#### 主题
应用程序通过 CSS 变量支持自定义主题。您可以在 `src/index.css` 中修改主题颜色：

```css
:root {
  --color-excalidraw-purple: #5f57ff;
  --color-bg-primary: #ffffff;
  --color-text-primary: #1e1e1e;
  /* ... 更多变量 */
}
```

#### 组件
所有组件都是模块化的，可以轻松自定义或扩展。例如，`EditableText` 组件可以在应用程序中重复使用，满足任何内联编辑需求。

### 🤝 贡献指南

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

### 📝 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

---

## 📸 Screenshots | 截图

### Workspace View | 工作区视图
![Workspace](docs/screenshots/workspace.png)

### Drawing Interface | 绘图界面
![Drawing](docs/screenshots/drawing.png)

### Theme Options | 主题选项
![Themes](docs/screenshots/themes.png)

---

## 🔗 Links | 相关链接

- [Excalidraw Official](https://excalidraw.com/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Made with ❤️ by [Your Name]**