<template>
  <view class="plaza-scene">
    <view class="scene-map" @tap="movePlayer">
      <image
        class="scene-art"
        src="/static/plaza/world-phase-one.webp"
        mode="scaleToFill"
        @error="imageError = true"
        @load="imageError = false"
      />
      <view v-if="imageError" class="scene-image-error">
        场景图片暂未加载，仍可点招牌进入。
      </view>
      <view
        v-if="player.target"
        class="destination"
        :style="locate(player.target)"
      ></view>
      <view
        v-for="person in people"
        :key="person.id"
        class="town-person"
        :class="{ 'town-player': person.id === 'self' }"
        :style="locate(person.position)"
      >
        <view v-if="person.id === 'self'" class="player-label">你</view>
        <PlazaBean
          :skin="person.skin"
          :walking="person.moving && !paused"
          :facing="person.facing"
        />
      </view>
      <button
        v-for="house in houses"
        :key="house.id"
        class="entrance"
        :class="'entrance-' + house.id"
        :style="locate(house)"
        :aria-label="'进入' + house.name"
        @tap.stop="emit('enter', house)"
      >
        <view class="entrance-mark"></view>
        <text>{{ house.name }}</text>
        <text class="entrance-arrow">›</text>
      </button>
    </view>
    <view class="scene-toolbar">
      <view class="scene-instruction">
        <view class="player-dot"></view>
        <text>
          {{
            paused
              ? '已暂停，点步道继续'
              : player.moving
                ? '豆豆正在沿步道走过去'
                : '点步道，让豆豆出发'
          }}
        </text>
      </view>
      <view class="scene-controls">
        <button
          class="scene-control"
          :aria-pressed="paused"
          @tap="toggleMotion"
        >
          {{ paused ? '开启走动' : '暂停走动' }}
        </button>
        <button class="scene-control" @tap="reset">回到起点</button>
      </view>
    </view>
  </view>
</template>
<script setup>
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import PlazaBean from './PlazaBean.vue'
import { createPlazaWalker } from '../../utils/plaza-motion.js'
const props = defineProps({ active: { type: Boolean, default: true } })
const emit = defineEmits(['enter'])
const instance = getCurrentInstance()
const houses = [
  {
    id: 'partner',
    name: '找搭子',
    x: 0.28,
    y: 0.44,
    url: '/pages/partner/index'
  },
  { id: 'lost', name: '失物招领', x: 0.73, y: 0.39, url: '/pages/lost/index' },
  {
    id: 'market',
    name: '二手集市',
    x: 0.25,
    y: 0.79,
    url: '/pages/market/index'
  },
  {
    id: 'home',
    name: '自己的家',
    x: 0.81,
    y: 0.79,
    url: '/pages/home/index',
    tab: true
  }
]
const residents = [
  { id: 'self', skin: 'sprout', position: { x: 0.46, y: 0.68 }, speed: 0.12 },
  { id: 'peach', skin: 'peach', position: { x: 0.59, y: 0.39 }, speed: 0.022 },
  {
    id: 'purple',
    skin: 'purple',
    position: { x: 0.67, y: 0.55 },
    speed: 0.019
  },
  { id: 'mint', skin: 'mint', position: { x: 0.34, y: 0.6 }, speed: 0.025 }
]
const stops = [
  { x: 0.43, y: 0.36 },
  { x: 0.68, y: 0.45 },
  { x: 0.46, y: 0.68 },
  { x: 0.33, y: 0.5 }
]
let walkers = [],
  timer = null,
  previousTime = 0
let stopIndexes = [0, 1, 2, 3]
const people = ref([]),
  paused = ref(false),
  imageError = ref(false)
const player = computed(
  () => people.value[0] || { moving: false, target: null }
)
const locate = (point) => ({
  left: `${point.x * 100}%`,
  top: `${point.y * 100}%`
})
function refreshPeople() {
  people.value = walkers.map((walker, i) => ({
    id: residents[i].id,
    skin: residents[i].skin,
    ...walker.getState()
  }))
}
function reset() {
  walkers = residents.map((resident) => createPlazaWalker(resident))
  stopIndexes = [0, 1, 2, 3]
  refreshPeople()
}
reset()
function stopClock() {
  if (timer) clearInterval(timer)
  timer = null
}
function startClock() {
  stopClock()
  if (!props.active || paused.value) return
  previousTime = Date.now()
  timer = setInterval(() => {
    const now = Date.now(),
      elapsed = Math.min(0.1, (now - previousTime) / 1000)
    previousTime = now
    walkers.forEach((walker, index) => {
      if (index && !walker.getState().moving) {
        stopIndexes[index] = (stopIndexes[index] + 1) % stops.length
        walker.moveTo(stops[stopIndexes[index]])
      }
      walker.advance(elapsed)
    })
    refreshPeople()
  }, 50)
}
function toggleMotion() {
  paused.value = !paused.value
}
function movePlayer(event) {
  const touch = event.changedTouches?.[0] || event.touches?.[0]
  const clientPoint = touch || (Number.isFinite(event.clientX) ? event : null)
  const x = clientPoint?.clientX ?? event.detail?.x,
    y = clientPoint?.clientY ?? event.detail?.y
  if (!Number.isFinite(x) || !Number.isFinite(y)) return
  const query = uni.createSelectorQuery().in(instance.proxy)
  query.select('.scene-map').boundingClientRect()
  query.selectViewport().scrollOffset()
  query.exec(([bounds, scroll]) => {
    if (!bounds?.width || !bounds?.height || !props.active) return
    const scrollLeft = clientPoint ? 0 : scroll?.scrollLeft || 0,
      scrollTop = clientPoint ? 0 : scroll?.scrollTop || 0
    walkers[0].moveTo({
      x: (x - bounds.left - scrollLeft) / bounds.width,
      y: (y - bounds.top - scrollTop) / bounds.height
    })
    paused.value = false
    refreshPeople()
  })
}
watch([() => props.active, paused], startClock)
onMounted(() => {
  // #ifdef H5
  paused.value = Boolean(
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  // #endif
  startClock()
})
onUnmounted(stopClock)
</script>
<style scoped>
.plaza-scene {
  margin-top: 30rpx;
}
.scene-map {
  position: relative;
  width: 100%;
  padding-top: 62.578125%;
  overflow: hidden;
  border-radius: 24rpx;
  background: #dfe9c8;
  border: 2rpx solid #c5d2b9;
  box-shadow: 0 8rpx 0 #e0e6d5;
}
.scene-art {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.scene-image-error {
  position: absolute;
  top: 5%;
  left: 10%;
  width: 80%;
  padding: 10rpx;
  text-align: center;
  color: #304a3a;
  font-size: 23rpx;
  background: #fffef8;
  border-radius: 10rpx;
}
.entrance {
  position: absolute;
  z-index: 30;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 176rpx;
  min-width: 88px;
  height: 44px;
  min-height: 44px;
  padding: 8rpx 15rpx;
  white-space: nowrap;
  font-size: 24rpx;
  line-height: 1.35;
  font-weight: 650;
  color: #304a3a;
  background: #fffef8f5;
  border: 2rpx solid #d3dfc7;
  border-radius: 18rpx;
  box-shadow: 0 5rpx 0 #304a3a24;
}
.entrance text,
.entrance-mark {
  flex-shrink: 0;
  white-space: nowrap;
}
.entrance::after,
.scene-control::after {
  border: 0;
}
.entrance-arrow {
  color: #7d8b75;
  font-size: 30rpx;
}
.entrance-mark {
  width: 14rpx;
  height: 14rpx;
  border-radius: 3rpx;
  background: #9b86b7;
  transform: rotate(-8deg);
}
.entrance-lost .entrance-mark {
  background: #b57c58;
}
.entrance-market .entrance-mark {
  background: #c79b57;
}
.entrance-home .entrance-mark {
  background: #6e987a;
}
.entrance:active {
  background: #edf4e4;
  box-shadow: 0 2rpx 0 #304a3a24;
}
.town-person {
  position: absolute;
  z-index: 12;
  width: 58rpx;
  height: 76rpx;
  transform: translate(-50%, -83%);
  pointer-events: none;
}
.town-player {
  z-index: 14;
}
.player-label {
  position: absolute;
  left: 50%;
  top: -19rpx;
  transform: translateX(-50%);
  padding: 2rpx 9rpx;
  border-radius: 12rpx;
  background: #304a3a;
  color: #fffef8;
  font-size: 19rpx;
  line-height: 1.5;
}
.destination {
  position: absolute;
  z-index: 10;
  width: 25rpx;
  height: 15rpx;
  border: 3rpx solid #fffef8;
  box-shadow: 0 0 0 3rpx #45695788;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
.scene-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  flex-wrap: wrap;
  padding: 24rpx 0 0;
}
.scene-instruction {
  display: flex;
  align-items: center;
  gap: 10rpx;
  color: #65765f;
  font-size: 23rpx;
}
.player-dot {
  width: 12rpx;
  height: 12rpx;
  background: #99b87b;
  border-radius: 50%;
}
.scene-controls {
  display: flex;
  gap: 10rpx;
}
.scene-control {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 8rpx 12rpx;
  font-size: 23rpx;
  line-height: 1.4;
  color: #456957;
  background: #e9eedf;
}
</style>
