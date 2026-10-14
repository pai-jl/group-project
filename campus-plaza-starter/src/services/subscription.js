import { call } from './transport.js'
export const send = (params = {}) => call('subscription.send', params)
