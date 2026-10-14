export class ServiceError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
  }
}
export function requireThat(condition, code, message) {
  if (!condition) throw new ServiceError(code, message)
}
export function errorText(error) {
  return error?.message || '操作失败，请稍后重试'
}
