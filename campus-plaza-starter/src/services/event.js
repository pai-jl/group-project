import { call } from './transport.js'
export const list = (params = {}) => call('event.list', params)
export const get = (params = {}) => call('event.get', params)
export const createPlan = (params = {}) => call('event.createPlan', params)
