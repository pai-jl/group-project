<template>
  <view class="page plaza-page">
    <DemoNotice />
    <view class="plaza-header">
      <view class="plaza-brand">
        <view class="brand-bean"><PlazaBean /></view>
        <view>
          <view class="title">校园生活广场</view>
          <view class="subtitle">今天，去哪里逛逛？</view>
        </view>
      </view>
      <text class="plaza-date">{{ today }}</text>
    </view>
    <PlazaScene :active="active" @enter="enter" />
    <view class="plaza-quick-actions">
      <button class="primary" @tap="publish">发布搭子计划</button>
      <button class="secondary" @tap="goPartner">看看大家的计划</button>
    </view>
    <view class="plaza-section-heading">
      <view class="section-title">我的进行中计划</view>
      <button class="quiet-button" @tap="goHome">全部发布 ›</button>
    </view>
    <view v-if="error" class="error">
      {{ error }}
      <button class="secondary" @tap="loadPlan">重新读取</button>
    </view>
    <view v-else-if="loading" class="muted">正在读取你的计划…</view>
    <view v-else-if="ownPlan" class="panel own-plan">
      <view class="own-plan-top">
        <text class="tag">{{ ownPlan.category }}</text>
        <text class="muted">
          {{ ownPlan.memberIds.length }}/{{ ownPlan.capacity }} 人
        </text>
      </view>
      <view class="plan-title">{{ ownPlan.title }}</view>
      <view class="muted">
        {{ formatTime(ownPlan.startAt) }} ～ {{ formatTime(ownPlan.endAt) }}
      </view>
      <view class="muted">{{ ownPlan.location || ownPlan.campusName }}</view>
      <view class="actions">
        <button class="primary" @tap="recommend">找时间合拍的人</button>
        <button class="secondary" @tap="openContent('plan', ownPlan.id)">
          查看计划
        </button>
      </view>
    </view>
    <view v-else class="panel plaza-empty">
      <view class="plan-title">给下一次相遇留个计划</view>
      <view class="muted">
        写下想做的事、时间和地点，再看看谁和你时间合拍。
      </view>
      <button class="primary" @tap="publish">发布我的计划</button>
    </view>
    <view class="plaza-note">
      <text>技能互助在找搭子小屋里</text>
      <text>邀请与联系进度，在底部「消息」查看。</text>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import { myContent } from '../../services/index.js'
import { formatTime, openContent } from '../../utils/routes.js'
import { errorText } from '../../utils/errors.js'
import DemoNotice from '../../components/DemoNotice.vue'
import PlazaBean from '../../components/plaza/PlazaBean.vue'
import PlazaScene from '../../components/plaza/PlazaScene.vue'
const active = ref(false),
  ownPlan = ref(null),
  loading = ref(false),
  error = ref('')
const today = new Date(Date.now() + 8 * 3600000)
  .toISOString()
  .slice(5, 10)
  .replace('-', ' / ')
let revision = 0
async function loadPlan() {
  const current = ++revision
  loading.value = true
  error.value = ''
  try {
    const result = await myContent.list({
      contentType: 'plan',
      status: 'open',
      pageSize: 1
    })
    if (current === revision) ownPlan.value = result.items[0] || null
  } catch (e) {
    if (current === revision) {
      ownPlan.value = null
      error.value = errorText(e)
    }
  } finally {
    if (current === revision) loading.value = false
  }
}
function enter(house) {
  house.tab
    ? uni.switchTab({ url: house.url })
    : uni.navigateTo({ url: house.url })
}
function publish() {
  uni.navigateTo({ url: '/pages/content/publish?type=plan' })
}
function goPartner() {
  uni.navigateTo({ url: '/pages/partner/index' })
}
function goHome() {
  uni.switchTab({ url: '/pages/home/index' })
}
function recommend() {
  uni.navigateTo({
    url: `/pages/partner/candidates?planId=${encodeURIComponent(ownPlan.value.id)}`
  })
}
onShow(() => {
  active.value = true
  loadPlan()
})
onHide(() => {
  active.value = false
  revision++
})
</script>
<style scoped>
.plaza-page {
  max-width: 1120px;
}
.primary,
.secondary,
.quiet-button {
  font-size: 28rpx;
  line-height: 1.5;
  border-radius: 12rpx;
}
.primary::after,
.secondary::after,
.quiet-button::after {
  border: 0;
}
.plaza-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}
.plaza-brand {
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.brand-bean {
  width: 62rpx;
  height: 80rpx;
  flex-shrink: 0;
}
.plaza-header .title {
  font-size: 38rpx;
  letter-spacing: 0;
}
.plaza-date {
  color: #6f8167;
  font-size: 24rpx;
  white-space: nowrap;
}
.plaza-quick-actions {
  display: flex;
  gap: 18rpx;
  margin: 22rpx 0 14rpx;
}
.plaza-quick-actions button {
  flex: 1;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 10rpx;
}
.plaza-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12rpx;
  margin-top: 28rpx;
}
.plaza-section-heading .section-title {
  margin: 0;
}
.quiet-button {
  min-height: 44px;
  display: flex;
  align-items: center;
  background: transparent;
  padding: 0 4rpx;
  font-size: 24rpx;
  color: #456957;
}
.own-plan {
  margin: 12rpx 0 0;
  border-color: #cedbc4;
}
.own-plan-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.plan-title {
  font-size: 32rpx;
  font-weight: 650;
  line-height: 1.5;
  margin: 14rpx 0 10rpx;
}
.plaza-empty .primary {
  margin-top: 20rpx;
}
.plaza-note {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
  color: #78836e;
  font-size: 23rpx;
  line-height: 1.8;
  margin: 24rpx 0 0;
}
</style>
