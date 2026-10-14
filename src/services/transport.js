import { config } from '../config/index.js'
import { mockRequest } from '../mock/index.js'
import { getToken } from '../utils/session.js'
import { ServiceError } from '../utils/errors.js'
export async function call(method, params = {}) {
  let result
  if (config.apiMode === 'mock') result = await mockRequest(method, params)
  else if (config.apiMode === 'http') {
    if (!config.apiBaseUrl)
      throw new ServiceError('SERVICE_UNAVAILABLE', '请先配置后端地址')
    result = await new Promise((resolve, reject) =>
      uni.request({
        url: `${config.apiBaseUrl}/rpc`,
        method: 'POST',
        data: { method, params },
        timeout: 12000,
        header: {
          'Content-Type': 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
        },
        success: (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(
              new ServiceError(
                'SERVICE_UNAVAILABLE',
                `服务请求失败（${response.statusCode}）`
              )
            )
            return
          }
          resolve(response.data)
        },
        fail: () =>
          reject(
            new ServiceError(
              'SERVICE_UNAVAILABLE',
              '网络连接失败，请检查网络或服务地址'
            )
          )
      })
    )
  } else
    throw new ServiceError(
      'INVALID_ARGUMENT',
      '未知接口模式，请使用 mock 或 http'
    )
  if (!result || typeof result.code !== 'string' || !('data' in result))
    throw new ServiceError('SERVICE_UNAVAILABLE', '服务返回格式不符合约定')
  if (result.code !== 'OK')
    throw new ServiceError(result.code, result.message || '操作失败')
  return result.data
}
