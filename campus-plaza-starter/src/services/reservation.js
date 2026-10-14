import { call } from './transport.js'
export const respond = (params = {}) => call('reservation.respond', params)
export const complete = (params = {}) => call('reservation.complete', params)
