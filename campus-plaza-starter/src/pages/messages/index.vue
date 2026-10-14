<template>
  <view class="page">
    <DemoNotice />
    <view class="row">
      <view class="title">消息中心</view>
      <button class="secondary" :disabled="loading" @tap="load">刷新</button>
    </view>
    <view class="subtitle">二手、失物和搭子的联系都在这里</view>
    <view v-if="error" class="error">{{ error }}</view>
    <view class="section-title">搭子邀请</view>
    <view v-for="i in invitations" :key="i.id" class="panel">
      <view>{{ i.sender.nickname }} 邀请 {{ i.recipient.nickname }}</view>
      <view class="muted">状态：{{ labels[i.status] || i.status }}</view>
      <view class="actions">
        <button class="secondary" @tap="openContent('plan', i.targetPlanId)">
          查看目标计划
        </button>
        <template v-if="i.status === 'pending'">
          <template v-if="i.recipientId === session.user?.id">
            <button
              class="primary"
              :disabled="busy"
              @tap="respond(i, 'accept')"
            >
              接受
            </button>
            <button
              class="secondary"
              :disabled="busy"
              @tap="respond(i, 'reject')"
            >
              暂不接受
            </button>
          </template>
          <button
            v-else
            class="secondary"
            :disabled="busy"
            @tap="respond(i, 'cancel')"
          >
            取消邀请
          </button>
        </template>
      </view>
    </view>
    <button v-if="inviteCursor" class="secondary" @tap="moreInvites">
      更多邀请
    </button>
    <view class="section-title">联系消息</view>
    <view
      v-for="c in conversations"
      :key="c.id"
      class="panel"
      @tap="chat(c.id)"
    >
      <view class="row">
        <text>{{ c.contentTitle }}</text>
        <text class="link">进入 →</text>
      </view>
      <text class="muted">
        {{ contentNames[c.contentType] }} · 保留原内容链接
      </text>
    </view>
    <button
      v-if="conversationCursor"
      class="secondary"
      @tap="moreConversations"
    >
      更多会话
    </button>
    <view class="section-title">通知</view>
    <view v-for="n in notifications" :key="n.id" class="panel" @tap="read(n)">
      <view class="row">
        <text>{{ n.title }}</text>
        <text class="tag">{{ n.read ? '已读' : '未读' }}</text>
      </view>
      <text class="muted">{{ formatTime(n.createdAt) }} · 查看原内容 →</text>
    </view>
    <button v-if="noteCursor" class="secondary" @tap="moreNotes">
      更多通知
    </button>
    <EmptyState
      v-if="
        !loading &&
        !error &&
        !invitations.length &&
        !conversations.length &&
        !notifications.length
      "
      title="暂时没有消息"
      description="去联系一个发布者，或向相近计划发出邀请。"
    />
  </view>
</template>
<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { invitation, conversation, notification } from '../../services/index.js'
import { session } from '../../utils/session.js'
import {
  contentNames,
  openContent,
  formatTime,
  idempotencyKey
} from '../../utils/routes.js'
import { errorText } from '../../utils/errors.js'
import DemoNotice from '../../components/DemoNotice.vue'
import EmptyState from '../../components/EmptyState.vue'
const invitations = ref([]),
  conversations = ref([]),
  notifications = ref([]),
  error = ref(''),
  busy = ref(false),
  loading = ref(false),
  inviteCursor = ref(null),
  conversationCursor = ref(null),
  noteCursor = ref(null)
const labels = {
  pending: '等待确认',
  accepted: '已接受',
  rejected: '未接受',
  cancelled: '已取消',
  expired: '已失效'
}
async function load() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const [i, c, n] = await Promise.all([
      invitation.list(),
      conversation.list(),
      notification.list()
    ])
    invitations.value = i.items
    inviteCursor.value = i.nextCursor
    conversations.value = c.items
    conversationCursor.value = c.nextCursor
    notifications.value = n.items
    noteCursor.value = n.nextCursor
  } catch (e) {
    error.value = errorText(e)
  } finally {
    loading.value = false
  }
}
async function more(service, items, cursor) {
  try {
    const r = await service.list({ cursor: cursor.value })
    items.value.push(...r.items)
    cursor.value = r.nextCursor
  } catch (e) {
    error.value = errorText(e)
  }
}
function moreInvites() {
  more(invitation, invitations, inviteCursor)
}
function moreConversations() {
  more(conversation, conversations, conversationCursor)
}
function moreNotes() {
  more(notification, notifications, noteCursor)
}
function chat(id) {
  uni.navigateTo({ url: `/pages/messages/chat?id=${encodeURIComponent(id)}` })
}
async function respond(i, action) {
  if (busy.value) return
  busy.value = true
  error.value = ''
  try {
    await invitation.respond({
      invitationId: i.id,
      action,
      idempotencyKey: idempotencyKey()
    })
    await load()
  } catch (e) {
    error.value = errorText(e)
  } finally {
    busy.value = false
  }
}
async function read(n) {
  try {
    await notification.markRead({ notificationId: n.id })
    openContent(n.contentType, n.contentId)
  } catch (e) {
    error.value = errorText(e)
  }
}
onShow(load)
</script>
