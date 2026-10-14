import { reactive } from 'vue'
export const session = reactive({ user: null })
export function setSession(user) {
  session.user = user
}
export function setToken(token) {
  uni.setStorageSync('campus-plaza-token', token)
}
export function getToken() {
  return uni.getStorageSync('campus-plaza-token') || ''
}
