<script setup lang="ts">
import type { Props } from './types'

const props = withDefaults(defineProps<Props>(), {
  showLinks: true,
  customText: '© 2024 Vue + Vuetify 演示应用',
  fixed: false, // 默认使用正常文档流模式
  centered: true, // 默认居中对齐
})
</script>

<template>
  <v-footer
    :app="fixed"
    color="grey-darken-3"
    class="footer-container"
    :class="{
      'footer-sticky': fixed,
      'footer-normal': !fixed,
      'text-center': centered,
      'text-left': !centered,
    }"
  >
    <div
      class="py-2 w-100"
      :class="centered ? 'd-flex justify-center align-center' : 'd-flex align-center'"
    >
      <span class="text-body-2 text-grey-lighten-1" :class="centered ? 'footer-content' : ''">
        {{ customText }}
        <template v-if="showLinks">
          |
          <v-btn
            href="https://vuejs.org/"
            target="_blank"
            variant="text"
            size="small"
            color="grey-lighten-1"
            density="compact"
          >
            Vue.js
          </v-btn>
          |
          <v-btn
            href="https://vuetifyjs.com/"
            target="_blank"
            variant="text"
            size="small"
            color="grey-lighten-1"
            density="compact"
          >
            Vuetify
          </v-btn>
        </template>
      </span>
    </div>
  </v-footer>
</template>

<style scoped>
.footer-sticky {
  /* Sticky footer 样式 */
  /* 当内容不足时，页脚固定在视口底部 */
  /* 当内容超出时，页脚跟随在内容底部 */
  margin-top: auto;
  min-height: 48px;
}

.footer-normal {
  /* 正常文档流页脚样式 */
  margin-top: auto;
  min-height: 48px;
}

/* 确保页脚高度设置生效 */
:deep(.v-footer) {
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
}

/* 页脚容器居中对齐 */
.footer-container {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  text-align: center !important;
  width: 100% !important;
}

/* 优化页脚内容布局 */
.v-footer {
  padding: 0;
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
}

/* 页脚内容居中 */
.footer-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
}

/* 减少按钮间距 */
.v-btn {
  margin: 0 2px;
}
</style>
