import { call } from './transport.js'
export const estimate = (params = {}) => call('appraisal.estimate', params)
