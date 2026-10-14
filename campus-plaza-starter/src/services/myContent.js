import { call } from './transport.js'
export const list = (params = {}) => call('myContent.list', params)
