import { call } from './transport.js'
export const create = (params = {}) => call('report.create', params)
export const adminResolve = (params = {}) => call('report.adminResolve', params)
