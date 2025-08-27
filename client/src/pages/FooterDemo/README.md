# FooterDemo 页面架构说明

## 📁 目录结构

```
pages/FooterDemo/
├── index.vue              # 主页面组件
├── types.ts              # 📋 类型定义
├── stores/
│   └── index.ts          # 📦 状态管理
├── components/           # 🧩 页面专用组件
│   ├── ModeSelector.vue  # 模式选择器
│   ├── ConfigPanel.vue   # 配置面板
│   └── CodeExample.vue   # 代码示例
└── README.md            # 📖 本说明文档
```

## 🎯 重构说明

### 重构前（多个单独文件）

```
pages/FooterDemo/
├── Custom.vue    # 自定义演示
├── Default.vue   # 默认演示
├── Fixed.vue     # 固定演示
└── Main.vue      # 主演示页面
```

### 重构后（标准页面级结构）

- ✅ **统一入口**: `index.vue` 作为唯一主页面
- ✅ **状态管理**: `stores/index.ts` 管理演示状态
- ✅ **类型安全**: `types.ts` 定义所有类型
- ✅ **组件化**: 将演示功能拆分为可复用组件

## 🧩 组件职责分工

### ModeSelector.vue - 模式选择器

- 展示所有演示模式（默认、固定、自定义）
- 支持点击切换模式
- 高亮当前选中模式

### ConfigPanel.vue - 配置面板

- 实时修改页脚配置
- 开关控制（固定模式、显示链接）
- 自定义文本输入

### CodeExample.vue - 代码示例

- 显示当前配置对应的代码
- 实时更新配置参数
- 配置状态可视化

## 📦 状态管理策略

### useFooterDemoStore

```typescript
// 核心状态
currentMode: 'default' | 'fixed' | 'custom'
currentConfig: FooterConfig
showLongContent: boolean

// 演示数据
examples: DemoExample[]

// 主要方法
switchMode(mode) - 切换演示模式
updateConfig(config) - 更新配置
initialize() - 初始化状态
```

## 🎨 设计优势

1. **单一入口**: 所有演示集中在一个页面
2. **状态统一**: 使用 Pinia Store 管理所有状态
3. **组件复用**: 演示逻辑封装为组件
4. **类型安全**: 完整的 TypeScript 类型定义
5. **易于维护**: 清晰的目录结构和职责分离

## 🚀 扩展性

- **添加新模式**: 在 `examples` 数组中添加新配置
- **新增组件**: 在 `components/` 目录下创建
- **扩展配置**: 修改 `FooterConfig` 接口
- **增强功能**: 在 Store 中添加新的状态和方法

这种结构适合复杂的演示页面，便于团队协作和功能扩展。
