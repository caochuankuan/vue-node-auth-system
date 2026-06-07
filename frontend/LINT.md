# 前端代码规范配置

## 已配置的工具

### 1. ESLint
- **配置文件**: `eslint.config.js` (ESLint 10.x 新格式)
- **规则**:
  - Vue 3 推荐规则
  - TypeScript 推荐规则
  - 浏览器全局变量支持 (window, localStorage, fetch 等)
  - 关闭了过于严格的规则（如 no-explicit-any）

### 2. TypeScript
- **类型检查**: `vue-tsc`
- **类型声明**: `env.d.ts` (包含 .vue 文件类型声明)

## 可用命令

```bash
# 运行 ESLint 并自动修复
npm run lint

# 运行 TypeScript 类型检查
npm run type-check

# 开发服务器
npm run dev

# 构建项目
npm run build
```

## 常见问题

### Q: 如何添加新的 ESLint 规则？
A: 编辑 `eslint.config.js` 文件中的 `rules` 对象。

### Q: 如何忽略某些文件？
A: 在 `eslint.config.js` 的 `ignores` 数组中添加模式。

### Q: TypeScript 报错找不到 .vue 模块？
A: 确保 `env.d.ts` 文件中包含了 Vue 模块的类型声明。

## 当前配置特点

✅ 自动修复大部分代码风格问题
✅ 支持 Vue 3 Composition API
✅ 支持 TypeScript
✅ 浏览器全局变量无需声明
✅ 适合快速开发的宽松规则
