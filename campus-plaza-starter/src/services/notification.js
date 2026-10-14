import { call } from './transport.js'
export const list = (params = {}) => call('notification.list', params)
export const markRead = (params = {}) => call('notification.markRead', params)
