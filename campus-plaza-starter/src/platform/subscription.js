import { config } from '../config/index.js'
import { ServiceError } from '../utils/errors.js'
// 必须从用户点击触发；这只请求授权，不发送订阅消息。
export function requestSubscription() {
  // #ifdef MP-WEIXIN
  if (!config.templateIds.length)
    return Promise.reject(
      new ServiceError('SERVICE_UNAVAILABLE', '尚未配置微信订阅模板')
    )
  return new Promise((resolve, reject) =>
    uni.requestSubscribeMessage({
      tmplIds: config.templateIds,
      success: resolve,
      fail: () =>
        reject(new ServiceError('SERVICE_UNAVAILABLE', '订阅授权未完成'))
    })
  )
  // #endif
  // #ifndef MP-WEIXIN
  return Promise.reject(
    new ServiceError('NOT_SUPPORTED', '网页端请在消息中心查看结果')
  )
  // #endif
}
