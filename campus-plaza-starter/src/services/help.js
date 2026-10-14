import { call } from './transport.js'
export const create = (params = {}) => call('help.create', params)
export const get = (params = {}) => call('help.get', params)
export const list = (params = {}) => call('help.list', params)
export const update = (params = {}) => call('help.update', params)
export const complete = (params = {}) => call('help.complete', params)
export const getCandidates = (params = {}) => call('help.getCandidates', params)
