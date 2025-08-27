/**
 * AppFooter 组件相关的类型定义
 */

/**
 * 页脚组件属性接口
 */
export interface Props {
  /** 是否显示链接 */
  showLinks?: boolean
  /** 自定义文本内容 */
  customText?: string
  /** 是否固定在底部 */
  fixed?: boolean
  /** 是否居中对齐 */
  centered?: boolean
}

/**
 * 外部链接接口
 */
export interface FooterLink {
  /** 链接 URL */
  href: string
  /** 链接文本 */
  text: string
  /** 链接图标 */
  icon?: string
  /** 目标窗口 */
  target?: string
}

/**
 * 页脚配置接口
 */
export interface FooterConfig {
  /** 默认文本 */
  defaultText: string
  /** 默认链接列表 */
  defaultLinks: FooterLink[]
  /** 默认高度 */
  defaultHeight: number
}
