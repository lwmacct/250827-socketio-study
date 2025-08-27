<template>
  <v-card variant="outlined">
    <v-card-title>演示模式选择</v-card-title>
    <v-card-text>
      <v-row>
        <v-col v-for="example in examples" :key="example.id" cols="12" sm="4">
          <v-card
            :class="{ 'border-primary': currentMode === example.id }"
            class="demo-card cursor-pointer"
            variant="outlined"
            @click="$emit('switchMode', example.id as FooterMode)"
          >
            <v-card-text class="text-center">
              <v-icon :color="example.color" size="40" class="mb-2">
                {{ example.icon }}
              </v-icon>
              <div class="text-subtitle-1 font-weight-bold mb-1">
                {{ example.title }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ example.description }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { DemoExample, FooterMode } from '../types'

interface Props {
  examples: DemoExample[]
  currentMode: FooterMode
}

interface Emits {
  switchMode: [mode: FooterMode]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.demo-card {
  transition: all 0.3s ease;
  border-width: 2px;
  min-height: 140px;
}

.demo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.demo-card.border-primary {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
