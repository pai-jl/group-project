import { call } from './transport.js'
export const create = (params = {}) => call('plan.create', params)
export const update = (params = {}) => call('plan.update', params)
export const get = (params = {}) => call('plan.get', params)
export const list = (params = {}) => call('plan.list', params)
export const close = (params = {}) => call('plan.close', params)
export const complete = (params = {}) => call('plan.complete', params)
export const getCandidates = (params = {}) => call('plan.getCandidates', params)
