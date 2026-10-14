import { call } from './transport.js'
export const send = (params = {}) => call('message.send', params)
export const list = (params = {}) => call('message.list', params)
