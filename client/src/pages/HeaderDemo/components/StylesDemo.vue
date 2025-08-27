<template>
  <v-card variant="outlined" class="mb-6">
    <v-card-title class="d-flex align-center">
      <v-icon color="secondary" class="mr-2">mdi-palette</v-icon>
      样式控制演示
    </v-card-title>
    <v-card-text>
      <p class="text-body-1 mb-4">
        AppHeader 组件提供了丰富的颜色和样式控制选项，可以完全自定义外观。
        <strong>点击下方的主题卡片来实时切换样式！</strong>
      </p>

      <!-- 插槽控制开关 -->
      <v-card variant="tonal" class="mb-4">
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h3 class="text-h6 mb-2">插槽内容控制</h3>
              <p class="text-body-2 text-grey">
                切换是否显示自定义插槽内容，每个主题都有对应的插槽模板
              </p>
            </div>
            <v-switch
              :model-value="useSlotContent"
              :label="useSlotContent ? '显示插槽内容' : '隐藏插槽内容'"
              color="primary"
              hide-details
              @update:model-value="$emit('toggleSlot')"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- 主题选择器 -->
      <v-card variant="outlined">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-palette</v-icon>
          点击切换主题
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-for="theme in styleThemes" :key="theme.name" cols="12" sm="6" md="4" lg="3">
              <v-card
                :class="{ 'border-primary': currentStyle.color === theme.color }"
                class="theme-card cursor-pointer"
                variant="outlined"
                style="height: 200px"
                @click="$emit('switchTheme', theme)"
              >
                <v-card-text class="text-center pa-4">
                  <div
                    class="theme-preview mb-3"
                    :style="{
                      backgroundColor: `rgb(var(--v-theme-${theme.color}))`,
                      height: '60px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }"
                  >
                    {{ theme.name }}
                  </div>
                  <div class="text-subtitle-2 font-weight-bold">{{ theme.name }}</div>
                  <div class="text-caption text-grey">
                    color: {{ theme.color }}<br />
                    elevation: {{ theme.elevation }}<br />
                    height: {{ theme.height || '默认' }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 当前配置显示 -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card variant="tonal">
            <v-card-title>实时代码示例</v-card-title>
            <v-card-text>
              <pre class="text-caption"><code>&lt;AppHeader 
  title="样式控制演示"
  titleIcon="mdi-palette"
     color="{{ currentStyle.color }}"
   :elevation="{{ currentStyle.elevation }}"
   :height="{{ currentStyle.height || 'undefined' }}"
   navIconColor="{{ currentStyle.navIconColor }}"
/&gt;</code></pre>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card variant="tonal">
            <v-card-title>当前样式值</v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>颜色</v-list-item-title>
                  <template v-slot:append>
                    <v-chip :color="currentStyle.color" variant="outlined" size="small">
                      {{ currentStyle.color }}
                    </v-chip>
                  </template>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>阴影</v-list-item-title>
                  <template v-slot:append>
                    <v-chip color="grey" variant="outlined" size="small">
                      {{ currentStyle.elevation }}
                    </v-chip>
                  </template>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>高度</v-list-item-title>
                  <template v-slot:append>
                    <v-chip color="grey" variant="outlined" size="small">
                      {{ currentStyle.height || '默认' }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { HeaderStyleConfig, StyleTheme } from '../types'

interface Props {
  useSlotContent: boolean
  currentStyle: HeaderStyleConfig
  styleThemes: StyleTheme[]
}

interface Emits {
  toggleSlot: []
  switchTheme: [theme: StyleTheme]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.theme-card {
  transition: all 0.3s ease;
  border-width: 2px;
}

.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-card.border-primary {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
