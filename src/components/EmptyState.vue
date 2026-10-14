<template>
  <view class="empty">
    <text class="empty-title">{{ title }}</text>
    <text class="muted">{{ description }}</text>
  </view>
</template>
<script setup>
defineProps({
  title: { default: '这里还没有内容' },
  description: { default: '可以发布第一条，或者换个关键词试试。' }
})
</script>
<style scoped>
.empty {
  padding: 64rpx 24rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.empty-title {
  font-size: 30rpx;
}
</style>
