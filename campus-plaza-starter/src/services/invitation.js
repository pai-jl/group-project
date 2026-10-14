import { call } from './transport.js'
export const create = (params = {}) => call('invitation.create', params)
export const list = (params = {}) => call('invitation.list', params)
export const respond = (params = {}) => call('invitation.respond', params)
export const cancel = (params = {}) => call('invitation.cancel', params)
