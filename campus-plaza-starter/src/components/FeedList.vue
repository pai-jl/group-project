<template>
  <view class="page">
    <DemoNotice />
    <view class="row">
      <view>
        <view class="title">{{ title }}</view>
        <view class="subtitle">{{ subtitle }}</view>
      </view>
      <button class="primary" @tap="publish">发布</button>
    </view>
    <view class="panel">
      <input
        class="input"
        v-model="keyword"
        placeholder="搜索标题或说明"
        confirm-type="search"
        @confirm="load(true)"
      />
      <view class="actions">
        <button class="secondary" @tap="load(true)">搜索</button>
        <button class="secondary" @tap="clear">清空</button>
        <button v-if="type === 'plan'" class="secondary" @tap="openHelp">
          技能互助 →
        </button>
      </view>
    </view>
    <view v-if="error" class="error">{{ error }}</view>
    <view v-if="loading" class="muted">正在读取…</view>
    <ContentCard v-for="item in items" :key="item.id" :item="item" />
    <EmptyState v-if="!loading && !error && !items.length" />
    <button
      v-if="cursor"
      class="secondary"
      :disabled="loading"
      @tap="load(false)"
    >
      加载更多
    </button>
  </view>
</template>
<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import * as api from '../services/index.js'
import { errorText } from '../utils/errors.js'
import DemoNotice from './DemoNotice.vue'
import ContentCard from './ContentCard.vue'
import EmptyState from './EmptyState.vue'
const props = defineProps({
  type: { required: true },
  title: { required: true },
  subtitle: { default: '' }
})
const items = ref([]),
  keyword = ref(''),
  error = ref(''),
  loading = ref(false),
  cursor = ref(null)
const service = () =>
  api[props.type === 'lost_found' ? 'lostFound' : props.type]
async function load(reset) {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const page = await service().list({
      keyword: keyword.value,
      cursor: reset ? null : cursor.value
    })
    items.value = reset ? page.items : [...items.value, ...page.items]
    cursor.value = page.nextCursor
  } catch (e) {
    error.value = errorText(e)
  } finally {
    loading.value = false
  }
}
function publish() {
  uni.navigateTo({ url: `/pages/content/publish?type=${props.type}` })
}
function clear() {
  keyword.value = ''
  load(true)
}
function openHelp() {
  uni.navigateTo({ url: '/pages/help/index' })
}
onShow(() => load(true))
</script>
