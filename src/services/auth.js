import { call } from './transport.js'
import { setToken, setSession } from '../utils/session.js'
export async function login(params = {}) {
  const result = await call('auth.login', params)
  setToken(result.token)
  setSession(result.user)
  return result
}
