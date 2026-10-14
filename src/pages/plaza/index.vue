<template>
  <view class="page">
    <DemoNotice />
    <view class="row">
      <view>
        <view class="subtitle">CAMPUS / 像素生活广场</view>
        <view class="title">今天，去哪里逛逛？</view>
      </view>
      <view class="weather">晴 · 宜相遇</view>
    </view>
    <view class="town">
      <view class="path horizontal"></view>
      <view class="path vertical"></view>
      <view class="pond"></view>
      <view class="tree tree-a"></view>
      <view class="tree tree-b"></view>
      <view class="tree tree-c"></view>
      <view
        v-for="house in houses"
        :key="house.name"
        class="house"
        :class="house.className"
        @tap="enter(house)"
      >
        <view class="roof"></view>
        <view class="building">
          <view class="window"></view>
          <view class="door"></view>
        </view>
        <view class="sign">{{ house.name }} ↗</view>
      </view>
      <view class="noticeboard">
        <text>校园布告栏</text>
        <text class="board-small">主题活动待接入</text>
      </view>
      <view class="bean bean-a"><view class="eyes"></view></view>
      <view class="bean bean-b"><view class="eyes"></view></view>
      <view class="flower f1"></view>
      <view class="flower f2"></view>
      <view class="flower f3"></view>
    </view>
    <view class="muted">点房子进入，也可以从底部查看消息和个人空间。</view>
    <view class="panel">
      <view class="row">
        <text class="section-title" style="margin-top: 0">
          把计划说具体一点
        </text>
        <text class="tag">广场小提示</text>
      </view>
      <view class="body" style="margin-top: 16rpx">
        想做什么、哪一天、几点有空？发布之后，就能查看同校、同类且时间重叠的计划。
      </view>
      <view class="actions">
        <button class="primary" @tap="publish">发布搭子计划</button>
        <button class="secondary" @tap="goPartner">看看大家的计划</button>
      </view>
    </view>
  </view>
</template>
<script setup>
import DemoNotice from '../../components/DemoNotice.vue'
const houses = [
  { name: '二手集市', className: 'market', url: '/pages/market/index' },
  { name: '找搭子', className: 'partner', url: '/pages/partner/index' },
  { name: '失物招领', className: 'lost', url: '/pages/lost/index' },
  { name: '自己的家', className: 'home', url: '/pages/home/index', tab: true }
]
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
</script>
<style scoped>
.weather {
  font-size: 22rpx;
  color: #778768;
  background: #e8eddf;
  padding: 13rpx;
  border-radius: 12rpx;
  white-space: nowrap;
}
.town {
  height: 710rpx;
  background: #dfe9c8;
  border: 4rpx solid #9aac86;
  border-radius: 20rpx;
  margin: 30rpx 0 18rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 0 #c6d0b5;
}
.path {
  position: absolute;
  background: #efe0b4;
  border: 4rpx solid #dbcc9e;
}
.horizontal {
  left: 0;
  top: 335rpx;
  width: 100%;
  height: 88rpx;
}
.vertical {
  top: 0;
  left: 290rpx;
  width: 94rpx;
  height: 100%;
}
.house {
  position: absolute;
  width: 180rpx;
  height: 190rpx;
  z-index: 3;
}
.market {
  left: 46rpx;
  top: 80rpx;
}
.partner {
  right: 42rpx;
  top: 80rpx;
}
.lost {
  left: 46rpx;
  bottom: 50rpx;
}
.home {
  right: 42rpx;
  bottom: 50rpx;
}
.roof {
  position: absolute;
  left: 0;
  top: 0;
  width: 180rpx;
  height: 54rpx;
  background: #b66b50;
  border: 6rpx solid #7d533f;
  box-shadow: 8rpx 6rpx 0 #ad795a;
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
}
.building {
  position: absolute;
  top: 48rpx;
  left: 12rpx;
  width: 156rpx;
  height: 100rpx;
  background: #fff0cc;
  border: 6rpx solid #927754;
  box-shadow: 8rpx 8rpx 0 #b5be9b;
}
.window {
  position: absolute;
  width: 40rpx;
  height: 36rpx;
  left: 18rpx;
  top: 18rpx;
  background: #9bbcc2;
  border: 5rpx solid #927754;
}
.door {
  position: absolute;
  width: 38rpx;
  height: 65rpx;
  right: 20rpx;
  bottom: 0;
  background: #ba9870;
  border: 5rpx solid #927754;
}
.partner .roof {
  background: #77949b;
  border-color: #4b6e78;
}
.lost .roof {
  background: #cba860;
  border-color: #8d773f;
}
.home .roof {
  background: #ac88a0;
  border-color: #76546d;
}
.sign {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  background: #fff8e8;
  border: 3rpx solid #a49575;
  border-radius: 6rpx;
  font-size: 25rpx;
  font-weight: 650;
  padding: 8rpx 2rpx;
  box-shadow: 4rpx 4rpx 0 #c0c9a6;
}
.noticeboard {
  position: absolute;
  left: 260rpx;
  top: 243rpx;
  width: 150rpx;
  background: #fff8e8;
  border: 7rpx solid #9c7d55;
  padding: 10rpx 5rpx;
  text-align: center;
  font-size: 23rpx;
  z-index: 3;
}
.board-small {
  display: block;
  font-size: 18rpx;
  color: #8a846b;
  margin-top: 6rpx;
}
.tree {
  position: absolute;
  width: 62rpx;
  height: 62rpx;
  background: #87a06b;
  border: 6rpx solid #627f53;
  box-shadow: 10rpx 10rpx 0 #bbc99d;
}
.tree::after {
  content: '';
  position: absolute;
  top: 56rpx;
  left: 22rpx;
  height: 26rpx;
  width: 12rpx;
  background: #937451;
}
.tree-a {
  left: 30rpx;
  top: 12rpx;
}
.tree-b {
  right: 36rpx;
  top: 15rpx;
}
.tree-c {
  left: 20rpx;
  top: 446rpx;
}
.pond {
  position: absolute;
  right: 18rpx;
  top: 436rpx;
  width: 105rpx;
  height: 40rpx;
  background: #b0cdd0;
  border: 5rpx solid #9fbfc0;
  border-radius: 12rpx;
}
.bean {
  position: absolute;
  width: 38rpx;
  height: 48rpx;
  background: #fff4da;
  border: 4rpx solid #8a795c;
  border-radius: 16rpx 16rpx 10rpx 10rpx;
  z-index: 4;
}
.eyes {
  position: absolute;
  left: 7rpx;
  top: 14rpx;
  width: 4rpx;
  height: 6rpx;
  background: #514d42;
  box-shadow: 12rpx 0 0 #514d42;
}
.bean-a {
  top: 362rpx;
  left: 110rpx;
  animation: walk-a 11s linear infinite;
}
.bean-b {
  left: 321rpx;
  top: 500rpx;
  background: #e6b4a0;
  animation: walk-b 9s linear infinite;
}
@keyframes walk-a {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(380rpx);
  }
}
@keyframes walk-b {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-85rpx);
  }
}
.flower {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background: #d98a75;
  box-shadow:
    10rpx 0 0 #d98a75,
    5rpx -8rpx 0 #d98a75,
    5rpx 6rpx 0 #a4b56f;
}
.f1 {
  left: 230rpx;
  top: 470rpx;
}
.f2 {
  right: 220rpx;
  top: 40rpx;
}
.f3 {
  left: 210rpx;
  bottom: 12rpx;
}
</style>
