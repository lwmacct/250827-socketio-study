# AppFooter 组件架构说明

## 📁 目录结构

```
components/AppFooter/
├── index.vue                   # 主组件文件
├── types.ts                    # 📋 类型定义
├── stores/                    # 📦 状态管理模块
│   ├── index.ts               # 主 Store + 导出模块
│   ├── useFooterConfig.ts     # 页脚配置管理
│   └── useFooterLinks.ts      # 链接管理
├── utils/                     # 🛠️ 组件专用工具函数
│   ├── index.ts               # 工具函数主入口
│   └── config-helpers.ts      # 配置管理工具
└── components/                # 🧩 子组件目录
```

## 🎯 各文件职责分工

### 📋 types.ts - 类型定义

- **作用**: 定义组件属性和数据结构
- **时机**: 编译时静态检查
- **内容**:
  ```typescript
  interface Props {
    showLinks?: boolean
    customText?: string
    fixed?: boolean
  }
  ```

### 📦 stores/ - 状态管理模块

采用模块化设计，按功能拆分为多个 Composables：

#### stores/index.ts - 主 Store + 导出模块 (29行)

- **作用**: 组合各功能模块创建主 Store，同时导出所有模块
- **内容**:

  ```typescript
  // 主 Store - 组合各个功能模块
  export const useAppFooterStore = defineStore('appFooter', () => {
    const footerConfig = useFooterConfig()
    const footerLinks = useFooterLinks(footerConfig.finalConfig)

    return {
      ...footerConfig,
      ...footerLinks,
    }
  })

  // 导出各个功能模块（可按需使用）
  export { useFooterConfig, useFooterLinks }
  ```

#### stores/useFooterConfig.ts - 页脚配置管理 (74行)

- **作用**: 管理页脚的基本配置、文本内容、高度等设置
- **主要功能**: `updateConfig()`, `resetConfig()`, `batchUpdateConfig()`
- **特点**: 集成配置验证和默认值管理

#### stores/useFooterLinks.ts - 链接管理 (109行)

- **作用**: 处理页脚链接的增删改查和排序功能
- **主要功能**: `addLink()`, `removeLink()`, `sortLinks()`, `batchAddLinks()`
- **特点**: 提供丰富的链接操作方法和验证机制

### 🛠️ utils/ - 组件专用工具函数

专门为 AppFooter 组件提供的工具函数库：

#### utils/config-helpers.ts - 配置管理工具

- **作用**: 提供配置管理和链接管理的静态工具方法
- **主要类**:
  - `FooterConfigManager` - 配置对象的合并、验证、克隆等操作
  - `FooterLinkManager` - 链接的增删改查、排序、验证等操作
- **使用示例**:

  ```typescript
  import { configHelpers, linkHelpers } from './utils'

  // 配置管理
  const merged = configHelpers.mergeConfig(defaultConfig, customConfig)
  const isValid = configHelpers.validateConfig(config)

  // 链接管理
  const newLinks = linkHelpers.addLink(existingLinks, newLink)
  const sortedLinks = linkHelpers.sortLinks(links, 'text', 'asc')
  ```

## 💡 组件特性

### ✅ 功能特点

- 🎨 支持固定和正常两种显示模式
- 🔗 可配置是否显示外部链接
- 📝 支持自定义文本内容
- 📱 响应式设计，适配不同屏幕
- ⚙️ 通过 Store 管理配置状态

### 🎛️ 配置选项

| 属性         | 类型      | 默认值                             | 说明               |
| ------------ | --------- | ---------------------------------- | ------------------ |
| `showLinks`  | `boolean` | `true`                             | 是否显示外部链接   |
| `customText` | `string`  | `'© 2024 Vue + Vuetify 演示应用'` | 自定义文本内容     |
| `fixed`      | `boolean` | `false`                            | 是否固定在页面底部 |
| `centered`   | `boolean` | `true`                             | 是否居中对齐       |

## 🚀 使用方式

### 基础用法

```vue
<template>
  <AppFooter />
</template>
```

### 高级配置

```vue
<template>
  <AppFooter :show-links="true" custom-text="© 2024 我的应用" :fixed="false" />
</template>
```

### 使用 Store 管理配置

```typescript
import { useAppFooterStore } from '@/components/AppFooter/stores'

const footerStore = useAppFooterStore()

// 配置管理
footerStore.updateConfig({
  defaultText: '© 2024 自定义应用',
  defaultHeight: 60,
})

// 链接管理
footerStore.addLink({ href: '/help', text: '帮助', target: '_self' }, footerStore.updateConfig)
footerStore.removeLink('https://vuejs.org/', footerStore.updateConfig)

// 或者按需使用独立的 Composables
import { useFooterConfig, useFooterLinks } from '@/components/AppFooter/stores'

const config = useFooterConfig()
const links = useFooterLinks(config.finalConfig)

config.updateConfig({ defaultText: '新文本' })
links.addLink({ href: '/new', text: '新链接' }, config.updateConfig)
```

### 居中对齐控制

```vue
<template>
  <!-- 默认居中对齐 -->
  <AppFooter />

  <!-- 强制居中对齐 -->
  <AppFooter :centered="true" />

  <!-- 左对齐 -->
  <AppFooter :centered="false" />
</template>
```
