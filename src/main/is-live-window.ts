/**
 * 用于在 TS 中正确收窄「窗口仍存在且未销毁」，
 * 避免自定义 boolean 守卫无法收窄 `| null` 的问题。
 */
export function isLiveWindow<T extends { isDestroyed(): boolean }>(
  target: T | null | undefined
): target is T {
  return target != null && !target.isDestroyed()
}
