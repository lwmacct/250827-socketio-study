<template>
  <v-card variant="outlined">
    <v-card-title>配置面板</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-switch
            :model-value="config.fixed"
            label="固定页脚模式"
            color="primary"
            hide-details
            @update:model-value="$emit('updateConfig', { fixed: Boolean($event) })"
          />
          <v-chip :color="config.fixed ? 'success' : 'default'" class="mt-2" size="small">
            {{ config.fixed ? '固定模式' : '正常模式' }}
          </v-chip>
        </v-col>

        <v-col cols="12" sm="6">
          <v-switch
            :model-value="showLongContent"
            label="显示长内容"
            color="primary"
            hide-details
            @update:model-value="$emit('toggleLongContent')"
          />
          <v-chip :color="showLongContent ? 'warning' : 'default'" class="mt-2" size="small">
            {{ showLongContent ? '长内容模式' : '短内容模式' }}
          </v-chip>
        </v-col>

        <v-col cols="12">
          <v-text-field
            :model-value="config.customText"
            label="自定义文本"
            placeholder="例如：© 2024 我的公司"
            variant="outlined"
            density="compact"
            @update:model-value="$emit('updateConfig', { customText: $event || undefined })"
          />
        </v-col>

        <v-col cols="12">
          <v-switch
            :model-value="config.showLinks"
            label="显示链接"
            color="primary"
            hide-details
            @update:model-value="$emit('updateConfig', { showLinks: Boolean($event) })"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { FooterConfig } from '../types'

interface Props {
  config: FooterConfig
  showLongContent: boolean
}

interface Emits {
  updateConfig: [config: Partial<FooterConfig>]
  toggleLongContent: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
