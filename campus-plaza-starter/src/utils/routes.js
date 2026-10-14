export const contentTypes = ['plan', 'help', 'market', 'lost_found']
export const contentNames = {
  plan: '搭子计划',
  help: '技能互助',
  market: '二手集市',
  lost_found: '失物招领'
}
export function contentUrl(type, id) {
  return `/pages/content/detail?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`
}
export function openContent(type, id) {
  uni.navigateTo({ url: contentUrl(type, id) })
}
export function openProfile(userId) {
  uni.navigateTo({
    url: `/pages/profile/index?userId=${encodeURIComponent(userId)}`
  })
}
export function formatTime(value) {
  if (!value) return ''
  const date = new Date(Date.parse(value) + 8 * 3600000)
  return `${date.getUTCMonth() + 1}月${date.getUTCDate()}日 ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}
export function localToIso(date, time) {
  const value = new Date(`${date}T${time}:00+08:00`)
  if (!Number.isFinite(value.getTime())) throw new Error('请选择有效日期与时间')
  return value.toISOString()
}
export function idempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
