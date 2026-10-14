import { config } from '../config/index.js'
import { createSeed } from './seed.js'
import { dispatch } from './engine.js'
import { ServiceError } from '../utils/errors.js'
import { setSession } from '../utils/session.js'
function read() {
  const stored = uni.getStorageSync(config.storageKey)
  if (stored && stored.version === 1) return stored
  const db = createSeed()
  uni.setStorageSync(config.storageKey, db)
  return db
}
export async function mockRequest(method, params) {
  const db = read()
  try {
    const data = dispatch(db, method, params)
    uni.setStorageSync(config.storageKey, db)
    setSession(db.users.find((u) => u.id === db.currentUserId))
    return { code: 'OK', message: '', data, requestId: `demo_${Date.now()}` }
  } catch (error) {
    if (!(error instanceof ServiceError)) throw error
    return {
      code: error.code,
      message: error.message,
      data: null,
      requestId: `demo_${Date.now()}`
    }
  }
}
export function demoUsers() {
  return config.apiMode === 'mock' ? read().users : []
}
export function switchDemoUser(id) {
  if (config.apiMode !== 'mock')
    throw new ServiceError('FORBIDDEN', '真实模式不能切换演示身份')
  const db = read()
  const user = db.users.find((u) => u.id === id)
  if (!user) throw new ServiceError('NOT_FOUND', '演示用户不存在')
  db.currentUserId = id
  uni.setStorageSync(config.storageKey, db)
  setSession(user)
}
export function resetDemo() {
  if (config.apiMode === 'mock') {
    uni.removeStorageSync(config.storageKey)
    const db = read()
    setSession(db.users[0])
  }
}
