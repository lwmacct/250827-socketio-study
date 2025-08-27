<template>
  <v-card variant="outlined">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-code-tags</v-icon>
      代码示例
    </v-card-title>
    <v-card-text>
      <pre class="bg-grey-lighten-4 pa-4 rounded"><code>{{ codeExample }}</code></pre>

      <v-divider class="my-4" />

      <div class="text-subtitle-2 mb-2">当前配置：</div>
      <v-chip-group>
        <v-chip :color="config.fixed ? 'success' : 'default'" size="small" variant="outlined">
          fixed: {{ config.fixed }}
        </v-chip>
        <v-chip :color="config.showLinks ? 'info' : 'default'" size="small" variant="outlined">
          showLinks: {{ config.showLinks }}
        </v-chip>
        <v-chip v-if="config.customText" color="warning" size="small" variant="outlined">
          customText: "{{ config.customText }}"
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { FooterConfig } from '../types'

interface Props {
  codeExample: string
  config: FooterConfig
}

defineProps<Props>()
</script>
