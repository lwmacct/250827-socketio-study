# HeaderDemo 页面架构说明

## 📁 目录结构

```
pages/HeaderDemo/
├── index.vue              # 主页面组件
├── types.ts              # 📋 类型定义
├── stores/
│   └── index.ts          # 📦 状态管理
├── components/           # 🧩 页面专用组件
│   ├── SlotTemplate.vue  # 插槽模板组件
│   ├── SlotDemo.vue      # 插槽演示说明
│   └── StylesDemo.vue    # 样式演示组件
└── README.md            # 📖 本说明文档
```

## 🎯 重构说明

### 重构前（多个单独文件）

```
pages/HeaderDemo/
├── index.vue        # 重定向文件
├── Slot.vue         # 插槽演示
├── SlotTemplate.vue # 插槽模板
├── Styles.vue       # 样式演示
└── README.md        # 说明文档
```

### 重构后（标准页面级结构）

- ✅ **统一入口**: `index.vue` 作为唯一主页面
- ✅ **状态管理**: `stores/index.ts` 管理演示状态
- ✅ **类型安全**: `types.ts` 定义所有类型
- ✅ **组件化**: 将演示功能拆分为可复用组件

## 🧩 组件职责分工

### SlotTemplate.vue - 插槽模板组件

- 完整的用户交互界面
- 响应式数据和事件处理
- 用户头像和抽屉功能
- GitHub 风格的用户菜单

### SlotDemo.vue - 插槽演示说明

- 插槽功能介绍和说明
- 使用方法和代码示例
- 功能特性列表

### StylesDemo.vue - 样式演示组件

- 主题选择器界面
- 样式配置实时预览
- 插槽内容控制开关
- 当前配置显示

## 📦 状态管理策略

### useHeaderDemoStore

```typescript
// 核心状态
currentMode: 'slot' | 'styles'
useSlotContent: boolean
currentStyle: HeaderStyleConfig

// 演示数据
examples: HeaderDemoExample[]
styleThemes: StyleTheme[]
userInfo: UserInfo

// 主要方法
switchMode(mode) - 切换演示模式
toggleSlotContent() - 切换插槽内容
switchTheme(theme) - 切换样式主题
initialize() - 初始化状态
```

## 🎨 设计优势

1. **模式切换**: 支持插槽和样式两种演示模式
2. **实时预览**: 样式更改立即在头部反映
3. **状态持久化**: 使用 localStorage 保存用户选择
4. **类型安全**: 完整的 TypeScript 类型定义
5. **组件复用**: 演示逻辑封装为独立组件

## 🚀 扩展性

- **添加新模式**: 在 `examples` 数组中添加新演示
- **新增主题**: 在 `styleThemes` 中添加新样式
- **扩展功能**: 在 Store 中添加新的状态和方法
- **组件扩展**: 在 `components/` 目录下添加新组件

这种结构使得头部组件的演示更加集中和易于管理，适合复杂的交互演示需求。
