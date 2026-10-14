import { call } from './transport.js'
export const create = (params = {}) => call('lostFound.create', params)
export const update = (params = {}) => call('lostFound.update', params)
export const get = (params = {}) => call('lostFound.get', params)
export const list = (params = {}) => call('lostFound.list', params)
export const markReturned = (params = {}) =>
  call('lostFound.markReturned', params)
