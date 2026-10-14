import { call } from './transport.js'
export const create = (params = {}) => call('upload.create', params)
export const confirm = (params = {}) => call('upload.confirm', params)
