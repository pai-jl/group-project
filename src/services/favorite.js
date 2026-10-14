import { call } from './transport.js'
export const set = (params = {}) => call('favorite.set', params)
export const list = (params = {}) => call('favorite.list', params)
