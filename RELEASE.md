# Release Guide | 发布指南

[English](#english) | [中文](#中文)

---

## English

This document describes how to create and publish releases for My Excalidraw.

### 🚀 Quick Release

Use the automated release script:

```bash
./scripts/release.sh 1.0.0
```

This script will:
1. Update the version in `package.json`
2. Prompt you to update `CHANGELOG.md`
3. Commit the changes
4. Create and push a git tag
5. Trigger GitHub Actions to build and release

### 📋 Manual Release Process

If you prefer to do it manually:

1. **Update Version**
   ```bash
   npm version 1.0.0 --no-git-tag-version
   ```

2. **Update CHANGELOG.md**
   - Add new version section
   - Document all changes and new features

3. **Commit Changes**
   ```bash
   git add package.json package-lock.json CHANGELOG.md
   git commit -m "chore: bump version to 1.0.0"
   ```

4. **Create and Push Tag**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin main
   git push origin v1.0.0
   ```

### 🏗️ Build Process

GitHub Actions will automatically:

1. **Build for Multiple Platforms**
   - macOS (Intel + Apple Silicon)
   - Windows (x64)
   - Linux (AppImage + DEB)

2. **Create GitHub Release**
   - Upload all build artifacts
   - Generate release notes
   - Publish the release

### 📦 Build Artifacts

The following files will be generated:

#### macOS
- `My-Excalidraw-Mac-x64-1.0.0.dmg` - Intel Macs
- `My-Excalidraw-Mac-arm64-1.0.0.dmg` - Apple Silicon Macs

#### Windows
- `My-Excalidraw-Windows-1.0.0-Setup.exe` - Windows installer

#### Linux
- `My-Excalidraw-Linux-1.0.0.AppImage` - Universal Linux
- `My-Excalidraw-Linux-1.0.0.deb` - Debian/Ubuntu

### 🔧 Local Building

To test builds locally:

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux

# Build directory only (faster, for testing)
npm run build:dir
```

### 📋 Pre-release Checklist

Before creating a release:

- [ ] All tests pass (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Application runs correctly in development (`npm run dev`)
- [ ] CHANGELOG.md is updated
- [ ] Version number follows [Semantic Versioning](https://semver.org/)
- [ ] All new features are documented
- [ ] Breaking changes are clearly noted

### 🐛 Troubleshooting

#### Build Fails
- Check that all dependencies are installed: `npm ci`
- Ensure TypeScript compiles: `npm run type-check`
- Verify linting passes: `npm run lint`

#### Icons Missing
- Add required icon files to the `build/` directory
- See `build/README.md` for icon requirements

#### GitHub Actions Fails
- Check the Actions tab in your GitHub repository
- Ensure `GITHUB_TOKEN` has proper permissions
- Verify the repository settings allow Actions

---

## 中文

本文档描述如何为 My Excalidraw 创建和发布版本。

### 🚀 快速发布

使用自动化发布脚本：

```bash
./scripts/release.sh 1.0.0
```

此脚本将：
1. 更新 `package.json` 中的版本
2. 提示您更新 `CHANGELOG.md`
3. 提交更改
4. 创建并推送 git 标签
5. 触发 GitHub Actions 构建和发布

### 📋 手动发布流程

如果您更喜欢手动操作：

1. **更新版本**
   ```bash
   npm version 1.0.0 --no-git-tag-version
   ```

2. **更新 CHANGELOG.md**
   - 添加新版本部分
   - 记录所有更改和新功能

3. **提交更改**
   ```bash
   git add package.json package-lock.json CHANGELOG.md
   git commit -m "chore: bump version to 1.0.0"
   ```

4. **创建并推送标签**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin main
   git push origin v1.0.0
   ```

### 🏗️ 构建流程

GitHub Actions 将自动：

1. **为多个平台构建**
   - macOS（Intel + Apple Silicon）
   - Windows（x64）
   - Linux（AppImage + DEB）

2. **创建 GitHub Release**
   - 上传所有构建产物
   - 生成发布说明
   - 发布版本

### 📦 构建产物

将生成以下文件：

#### macOS
- `My-Excalidraw-Mac-x64-1.0.0.dmg` - Intel Mac
- `My-Excalidraw-Mac-arm64-1.0.0.dmg` - Apple Silicon Mac

#### Windows
- `My-Excalidraw-Windows-1.0.0-Setup.exe` - Windows 安装程序

#### Linux
- `My-Excalidraw-Linux-1.0.0.AppImage` - 通用 Linux
- `My-Excalidraw-Linux-1.0.0.deb` - Debian/Ubuntu

### 🔧 本地构建

测试本地构建：

```bash
# 为当前平台构建
npm run build

# 为特定平台构建
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux

# 仅构建目录（更快，用于测试）
npm run build:dir
```

### 📋 发布前检查清单

创建发布前：

- [ ] 所有测试通过（`npm run lint`）
- [ ] TypeScript 编译无错误（`npm run type-check`）
- [ ] 应用程序在开发环境中正常运行（`npm run dev`）
- [ ] CHANGELOG.md 已更新
- [ ] 版本号遵循[语义化版本控制](https://semver.org/)
- [ ] 所有新功能都有文档
- [ ] 破坏性更改已明确标注

### 🐛 故障排除

#### 构建失败
- 检查所有依赖项是否已安装：`npm ci`
- 确保 TypeScript 编译：`npm run type-check`
- 验证代码检查通过：`npm run lint`

#### 图标缺失
- 将所需的图标文件添加到 `build/` 目录
- 查看 `build/README.md` 了解图标要求

#### GitHub Actions 失败
- 检查 GitHub 仓库中的 Actions 选项卡
- 确保 `GITHUB_TOKEN` 具有适当权限
- 验证仓库设置允许 Actions

---

## 📞 Support | 支持

If you encounter any issues during the release process, please:
- Check the [GitHub Issues](https://github.com/yourusername/my-excalidraw/issues)
- Create a new issue with detailed information
- Include logs and error messages

如果在发布过程中遇到任何问题，请：
- 查看 [GitHub Issues](https://github.com/yourusername/my-excalidraw/issues)
- 创建包含详细信息的新问题
- 包含日志和错误消息
