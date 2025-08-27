# Home 页面架构说明

## 📁 目录结构

```
pages/Home/
├── index.vue          # 主页面组件
├── types.ts          # 📋 类型定义
├── stores/
│   └── index.ts      # 📦 状态管理
└── components/       # 🧩 页面专用组件
```

## 🎯 各文件职责分工

### 📋 types.ts - 类型定义

- **作用**: 定义数据结构和接口
- **时机**: 编译时静态检查
- **内容**:
  ```typescript
  interface FeatureItem {
    id: string
    title: string
    // ...
  }
  ```

### 📦 stores/index.ts - 状态管理

- **作用**: 管理页面状态和业务逻辑
- **时机**: 运行时动态管理
- **内容**:
  ```typescript
  export const useHomeStore = defineStore('home', () => {
    const stats = ref({ visitCount: 0 })
    const recordVisit = () => { ... }
    return { stats, recordVisit }
  })
  ```

## 💡 何时使用什么

### 使用 types.ts 当：

- ✅ 定义接口和数据结构
- ✅ 约束函数参数和返回值
- ✅ 为组件 props 定义类型
- ✅ 提供 IDE 智能提示

### 使用 Pinia Store 当：

- ✅ 需要响应式状态管理
- ✅ 状态需要在多个组件间共享
- ✅ 需要复杂的业务逻辑
- ✅ 需要数据持久化

## 🏗️ 简洁的页面级架构

### ✅ 核心文件职责

1. **📋 types.ts**: 类型定义和接口约束
2. **📦 stores/index.ts**: 页面状态管理和业务逻辑
3. **🧩 components/**: 页面专用组件（按需添加）

### 🎯 设计原则

- **最小化**: 只保留必要的文件和功能
- **职责明确**: 每个文件有单一职责
- **易于理解**: 新手可以快速上手的结构
- **可扩展**: 需要时可以轻松添加 composables 等
