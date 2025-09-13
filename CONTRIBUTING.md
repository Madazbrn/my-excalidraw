# Contributing to My Excalidraw | 贡献指南

[English](#english) | [中文](#中文)

---

## English

Thank you for your interest in contributing to My Excalidraw! This document provides guidelines and information for contributors.

### 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/my-excalidraw.git
   cd my-excalidraw
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

### 🛠️ Development Workflow

#### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

#### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(workspace): add file sorting options
fix(theme): resolve dark mode toggle issue
docs(readme): update installation instructions
refactor(components): extract EditableText component
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance tasks

### 🧪 Testing

- Run linting: `npm run lint`
- Ensure TypeScript compilation: `npm run build`
- Test the application thoroughly in both light and dark themes
- Verify cross-platform compatibility when possible

### 📝 Code Style

#### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

#### React
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance
- Use `useCallback` and `useMemo` when appropriate

#### CSS
- Use Tailwind CSS classes when possible
- Define custom CSS variables for theming
- Follow the existing color scheme and spacing
- Ensure responsive design

### 🎨 Component Guidelines

#### Creating New Components
1. Place components in appropriate directories
2. Export from `index.ts` files
3. Include proper TypeScript interfaces
4. Add JSDoc comments for complex logic
5. Ensure accessibility (ARIA labels, keyboard navigation)

#### EditableText Component Example
```typescript
interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  maxLength?: number;
  disabled?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  className = '',
  maxLength,
  disabled = false,
}) => {
  // Implementation
};
```

### 🐛 Bug Reports

When reporting bugs, please include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node.js version, browser (if applicable)
- **Screenshots**: If applicable

### ✨ Feature Requests

For feature requests, please provide:
- **Use Case**: Why this feature would be useful
- **Description**: Detailed description of the feature
- **Mockups**: Visual mockups if applicable
- **Implementation Ideas**: Any thoughts on implementation

### 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for public APIs
- Update CHANGELOG.md for releases
- Include inline comments for complex logic

### 🔍 Code Review Process

1. **Self-review** your code before submitting
2. **Test thoroughly** in different scenarios
3. **Update documentation** as needed
4. **Request review** from maintainers
5. **Address feedback** promptly and professionally

### 🎯 Areas for Contribution

#### High Priority
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Cross-platform testing
- [ ] Error handling enhancements

#### Medium Priority
- [ ] Additional export formats
- [ ] Advanced search functionality
- [ ] Keyboard shortcut customization
- [ ] Plugin system foundation

#### Low Priority
- [ ] UI/UX improvements
- [ ] Additional themes
- [ ] Internationalization
- [ ] Advanced file organization

---

## 中文

感谢您对 My Excalidraw 项目的贡献兴趣！本文档为贡献者提供指南和信息。

### 🚀 开始贡献

1. **Fork 仓库** 在 GitHub 上
2. **克隆您的 fork** 到本地：
   ```bash
   git clone https://github.com/yourusername/my-excalidraw.git
   cd my-excalidraw
   ```
3. **安装依赖**：
   ```bash
   npm install
   ```
4. **启动开发服务器**：
   ```bash
   npm run dev
   ```

### 🛠️ 开发工作流

#### 分支命名
- `feature/description` - 新功能
- `fix/description` - 错误修复
- `docs/description` - 文档更新
- `refactor/description` - 代码重构
- `test/description` - 测试改进

#### 提交信息
遵循 [约定式提交](https://www.conventionalcommits.org/) 规范：

```
type(scope): description

feat(workspace): 添加文件排序选项
fix(theme): 解决深色模式切换问题
docs(readme): 更新安装说明
refactor(components): 提取 EditableText 组件
```

### 🧪 测试

- 运行代码检查：`npm run lint`
- 确保 TypeScript 编译：`npm run build`
- 在浅色和深色主题下彻底测试应用程序
- 在可能的情况下验证跨平台兼容性

### 📝 代码风格

#### TypeScript
- 所有新代码使用 TypeScript
- 定义适当的接口和类型
- 除非绝对必要，避免使用 `any` 类型
- 使用有意义的变量和函数名

#### React
- 使用带有 hooks 的函数组件
- 实现适当的错误边界
- 遵循 React 性能最佳实践
- 适当时使用 `useCallback` 和 `useMemo`

#### CSS
- 尽可能使用 Tailwind CSS 类
- 为主题定义自定义 CSS 变量
- 遵循现有的颜色方案和间距
- 确保响应式设计

### 🐛 错误报告

报告错误时，请包含：
- **描述**：问题的清晰描述
- **重现步骤**：重现错误的详细步骤
- **期望行为**：应该发生什么
- **实际行为**：实际发生了什么
- **环境**：操作系统、Node.js 版本、浏览器（如适用）
- **截图**：如果适用

### ✨ 功能请求

对于功能请求，请提供：
- **用例**：为什么这个功能有用
- **描述**：功能的详细描述
- **模型图**：如果适用的视觉模型
- **实现想法**：关于实现的任何想法

---

## 🤝 Community Guidelines | 社区准则

- Be respectful and inclusive | 保持尊重和包容
- Provide constructive feedback | 提供建设性反馈
- Help others learn and grow | 帮助他人学习和成长
- Follow the code of conduct | 遵循行为准则

## 📞 Contact | 联系方式

- GitHub Issues: For bug reports and feature requests
- GitHub Discussions: For general questions and community chat

Thank you for contributing! | 感谢您的贡献！
