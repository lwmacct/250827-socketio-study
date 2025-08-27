<script setup lang="ts">
import { useAppHeaderStore } from '../stores'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

interface Props {
  onRemoveFromFavorites: (path: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  onRemoveFromFavorites: () => {},
})

const routeMenuStore = useAppHeaderStore()
const router = useRouter()
const draggedItem = ref<any>(null)
const dragOverItem = ref<any>(null)

// 处理点击事件
const handleClick = (product: any) => {
  router.push(product.path)
}

// 移除收藏项
const removeFromFavorites = (path: string) => {
  routeMenuStore.toggleFavorite(path)
}

// 拖拽开始
const handleDragStart = (event: DragEvent, item: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', item.path)
    draggedItem.value = item
  }
}

// 拖拽悬停
const handleDragOver = (event: DragEvent, item: any) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverItem.value = item
}

// 拖拽放置
const handleDrop = (event: DragEvent, targetItem: any) => {
  event.preventDefault()

  if (draggedItem.value && draggedItem.value.path !== targetItem.path) {
    const favoriteItems = routeMenuStore.favoriteItems
    const fromIndex = favoriteItems.findIndex((item) => item.path === draggedItem.value!.path)
    const toIndex = favoriteItems.findIndex((item) => item.path === targetItem.path)

    if (fromIndex !== -1 && toIndex !== -1) {
      // 实现拖拽排序功能
      routeMenuStore.reorderFavorites(fromIndex, toIndex)
    }
  }

  draggedItem.value = null
  dragOverItem.value = null
}

// 拖拽结束
const handleDragEnd = () => {
  draggedItem.value = null
  dragOverItem.value = null
}
</script>

<template>
  <div class="favorite-menu">
    <!-- 收藏页面标题 -->
    <v-list-subheader class="text-white text-caption px-4 py-2"> 收藏页面 </v-list-subheader>

    <!-- 收藏的产品列表 -->
    <div v-if="routeMenuStore.favoriteItems.length > 0">
      <div
        v-for="(product, index) in routeMenuStore.favoriteItems"
        :key="product.path"
        class="menu-item-container"
        :class="{
          dragging: draggedItem?.path === product.path,
          'drag-over': dragOverItem?.path === product.path,
        }"
        draggable="true"
        @dragstart="handleDragStart($event, product)"
        @dragover="handleDragOver($event, product)"
        @drop="handleDrop($event, product)"
        @dragend="handleDragEnd"
      >
        <v-list-item @click="handleClick(product)" class="menu-item" color="white" variant="text">
          <template v-slot:prepend>
            <v-icon color="white">{{ product.icon }}</v-icon>
          </template>
          <v-list-item-title class="text-white">
            {{ product.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-grey-lighten-2 text-caption">
            {{ product.category || '收藏项目' }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn
              icon="mdi-star"
              variant="text"
              size="small"
              color="white"
              class="favorite-active"
              @click.stop="removeFromFavorites(product.path)"
            ></v-btn>
          </template>
        </v-list-item>
      </div>
    </div>
    <div v-else class="px-4 py-2">
      <v-chip color="grey" variant="outlined" size="small"> 暂无收藏页面 </v-chip>
    </div>
  </div>
</template>

<style scoped>
.favorite-menu {
  margin-top: 0px;
}

.menu-item-container {
  position: relative;
  cursor: grab;
  transition: all 0.2s ease-in-out;
  margin: 0;
  padding: 0;
}

.menu-item-container:active {
  cursor: grabbing;
}

.menu-item-container.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.menu-item-container.drag-over {
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.menu-item {
  transition: all 0.2s ease-in-out;
  border-radius: 4px;
  margin: 2px 8px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.favorite-active {
  color: #ffd700 !important;
}
</style>
