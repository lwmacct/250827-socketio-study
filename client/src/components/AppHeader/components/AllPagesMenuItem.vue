<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  hoveredItem?: string | null
  onMouseEnter: (itemId: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  hoveredItem: null,
  onMouseEnter: () => {},
})
</script>

<template>
  <div class="all-pages-section" @mouseenter="onMouseEnter('all-products')">
    <v-list-item
      :active="hoveredItem === 'all-products'"
      color="white"
      variant="text"
      class="all-pages-item"
      link
    >
      <template v-slot:prepend>
        <v-icon color="white">mdi-view-grid</v-icon>
      </template>
      <v-list-item-title class="text-white"> 所有页面 </v-list-item-title>
      <template v-slot:append>
        <v-icon color="white" class="chevron-icon">mdi-chevron-right</v-icon>
      </template>
    </v-list-item>
  </div>
</template>

<style scoped>
.all-pages-section {
  margin-top: 10px;
}

.all-pages-item {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.all-pages-item:hover .chevron-icon {
  transform: translateX(4px);
}
</style>
