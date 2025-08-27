# Vue 3 + Vuetify 3 + TypeScript 模板项目

这是一个基于 Vue 3、Vuetify 3 和 TypeScript 构建的现代化 Web 应用模板，演示了页面级架构的最佳实践。

## 📁 项目目录结构

### 核心目录组织原则

```
src/
├── views/              # 📄 简单页面 (单文件组件)
│   ├── Home.vue
│   ├── About.vue
│   ├── Dashboard.vue
│   └── Login.vue
├── pages/              # 📁 复杂页面 (目录结构)
│   ├── Home/           # 复杂首页示例
│   │   ├── index.vue   # 主页面入口
│   │   ├── types.ts    # 页面类型定义  
│   │   ├── stores/     # 页面级状态管理
│   │   │   └── index.ts
│   │   ├── components/ # 页面专用组件
│   │   └── README.md   # 页面文档
│   ├── HeaderDemo/     # 头部组件演示
│   └── FooterDemo/     # 页脚组件演示
├── components/         # 🧩 全局共享组件
├── stores/            # 📦 全局状态管理
├── types/             # 📋 全局类型定义
├── utils/             # 🛠️ 工具函数
└── router/            # 🛣️ 路由配置
```

## 🎯 页面组织规则

### 📄 使用 `views/` 当：
- ✅ **简单页面**：单文件就能完成所有功能
- ✅ **静态内容**：主要展示信息，交互较少
- ✅ **独立页面**：不需要复杂的子组件协作
- ✅ **快速开发**：原型阶段或简单功能页面

**示例**：
```vue
<!-- views/About.vue -->
<template>
  <div class="about">
    <h1>关于我们</h1>
    <p>这是关于页面的内容...</p>
  </div>
</template>
```

### 📁 使用 `pages/` 当：
- ✅ **复杂页面**：需要多个文件协作
- ✅ **业务逻辑复杂**：需要专门的状态管理
- ✅ **多个子组件**：页面有专用组件
- ✅ **团队协作**：多人开发同一页面的不同部分

**示例结构**：
```
pages/UserManagement/
├── index.vue              # 主页面
├── types.ts              # 页面类型定义
├── stores/               # 页面级状态管理
│   └── userStore.ts
├── components/           # 页面专用组件  
│   ├── UserList.vue
│   ├── UserForm.vue
│   └── UserFilters.vue
├── composables/          # 页面逻辑钩子 (可选)
│   └── useUserActions.ts
└── README.md             # 页面文档
```

## 📦 状态管理策略

### 全局状态 (`src/stores/`)
```typescript
// src/stores/auth.ts - 多页面共享
export const useAuthStore = defineStore('auth', () => {
  // 用户认证状态，全局共享
})
```

### 页面级状态 (`pages/PageName/stores/`)  
```typescript
// pages/Dashboard/stores/index.ts - 仅该页面使用
export const useDashboardStore = defineStore('dashboard', () => {
  // 仪表板专用状态，不污染全局
})
```

## 🚀 开发指南

### 决策流程图
```
新建页面
    ↓
页面复杂吗？
    ├── 否 → views/PageName.vue
    └── 是 → pages/PageName/
              ├── index.vue
              ├── types.ts  
              ├── stores/ (如需要)
              └── components/ (如需要)
```

### 迁移策略
```typescript
// 1. 开始：简单页面
views/Product.vue

// 2. 演进：页面变复杂
pages/Product/
├── index.vue          // 迁移原 views/Product.vue 内容
├── types.ts          // 提取类型定义
├── stores/           // 添加状态管理
└── components/       // 拆分子组件
```

## 💻 开发环境配置

### 推荐 IDE
- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 禁用 Vetur 插件以避免冲突

### 工具链
- **构建工具**: Vite 7.x (极速热重载)
- **UI 框架**: Vuetify 3 (Material Design 3)  
- **状态管理**: Pinia (Vue 官方推荐)
- **类型检查**: vue-tsc (Vue 专用 TypeScript 编译器)
- **任务管理**: [Taskfile](https://taskfile.dev) 

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
# 或使用 Taskfile
task dev
```

### 生产构建  
```bash
npm run build
```

### 类型检查 + 代码格式化
```bash
npm run type-check && npm run format
```

### 使用此模板创建新项目
```bash
npx degit lwmacct/250730-vuetifyjs-template.git#main my-project
cd my-project
npm install
npm run dev
```

## 📚 学习资源

### 项目特性
- ✅ **Vue 3** Composition API + `<script setup>`
- ✅ **TypeScript** 完整类型支持
- ✅ **Vuetify 3** Material Design 组件库
- ✅ **Pinia** 现代状态管理
- ✅ **页面级架构** 可扩展的目录结构
- ✅ **响应式设计** 移动端适配

### 架构亮点
- 🏗️ **渐进式复杂度**：简单页面用 views，复杂页面用 pages
- 📦 **状态隔离**：全局状态 vs 页面级状态
- 📋 **类型安全**：完整的 TypeScript 类型定义
- 🧩 **组件化**：可复用组件 + 页面专用组件
- 📖 **文档化**：每个复杂页面都有说明文档

## 🔗 相关链接

- **开发者**: [GitHub](https://github.com/lwmacct)
- **Dev Container**: [开发环境文档](https://www.yuque.com/lwmacct/vscode/dev-containers)
- **Vue 3**: [官方文档](https://vuejs.org/)
- **Vuetify 3**: [组件文档](https://vuetifyjs.com/)
- **Pinia**: [状态管理文档](https://pinia.vuejs.org/)

## 📋 任务管理

使用 Taskfile 查看可用命令：
```bash
task -a
```

---

**这是一个学习和生产就绪的 Vue 3 模板项目，适合团队协作和大型应用开发！** 🎉
