# Dashboard 页面架构说明

## 📁 目录结构

```
pages/Dashboard/
├── index.vue          # 主页面组件
├── types.ts          # 📋 类型定义
├── stores/
│   └── index.ts      # 📦 状态管理
├── mock/             # 🎭 Mock 数据
│   ├── stats.ts      # 统计数据
│   ├── activities.ts # 活动记录
│   ├── actions.ts    # 快速操作
│   └── index.ts      # 统一导出
└── components/       # 🧩 页面专用组件
```

## 🎯 各文件职责分工

### 📋 types.ts - 类型定义

- **作用**: 定义仪表盘相关的数据结构和接口
- **内容**:

  ```typescript
  interface StatCard {
    id: string
    title: string
    value: number | string
    icon: string
    color: string
  }

  interface ActivityItem {
    id: string
    title: string
    description: string
    timestamp: Date
  }
  ```

### 📦 stores/index.ts - 状态管理

- **作用**: 管理仪表盘状态、实时数据更新和用户操作
- **特性**:
  - 统计数据管理
  - 活动记录管理
  - 自动刷新控制
  - 数据持久化
  - Mock 数据集成

### 🎭 Mock 数据目录

#### mock/stats.ts - 统计数据

- 统计卡片数据定义
- 随机数据生成函数
- 支持数字和文本格式

#### mock/activities.ts - 活动记录

- 活动记录模板
- 随机活动生成
- 时间戳管理

#### mock/actions.ts - 快速操作

- 快速操作按钮配置
- 操作处理函数
- 支持自定义颜色和图标

#### mock/index.ts - 统一导出

- 所有 Mock 数据的聚合
- 配置项管理
- 便于统一管理和更新

## 💡 Mock 数据架构优势

### ✅ 职责分离

- Mock 数据与业务逻辑分离
- 便于测试和开发
- 易于维护和更新

### ✅ 类型安全

- 基于 TypeScript 接口约束
- 编译时类型检查
- IDE 智能提示支持

### ✅ 灵活配置

- 支持随机数据生成
- 可配置的刷新策略
- 模块化的数据管理

### ✅ 易于扩展

- 按功能模块分文件
- 支持新增数据类型
- 便于功能迭代

## 🏗️ 页面级架构特性

### 🔄 实时数据更新

- 自动刷新机制
- 手动刷新功能
- 随机数据模拟

### 📊 数据可视化

- 统计卡片展示
- 活动记录列表
- 快速操作面板

### 💾 数据持久化

- LocalStorage 存储
- 状态恢复功能
- 用户偏好记忆

### 🎨 现代化 UI

- Vuetify 3 Material Design
- 响应式布局
- 悬停动效和过渡

## 🔧 开发指南

### 添加新的统计项

1. 在 `mock/stats.ts` 中添加数据
2. 在 `types.ts` 中更新接口
3. 页面会自动渲染新的统计卡片

### 添加新的快速操作

1. 在 `mock/actions.ts` 中定义操作
2. 实现对应的处理函数
3. 操作会自动出现在快速操作面板

### 自定义活动记录

1. 在 `mock/activities.ts` 中添加模板
2. 使用 `generateRandomActivity()` 生成
3. 通过 Store 的 `addActivity()` 方法添加

这种架构模式为仪表盘提供了清晰的数据流、良好的可维护性和优秀的开发体验。
