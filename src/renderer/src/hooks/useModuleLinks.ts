import { useAuthHook } from './useAuth'
import { useTheme } from 'next-themes'
import { moduleLinks, ModuleKey, ModuleLink } from '@renderer/config/module-config'

export const useModuleLinks = (): Record<ModuleKey, ModuleLink> => {
  const { user } = useAuthHook()
  const { resolvedTheme } = useTheme()

  // 替换所有链接中的变量
  const replacedLinks: Record<ModuleKey, ModuleLink> = {} as Record<ModuleKey, ModuleLink>

  // 替换变量的函数
  const replaceVariables = (url: string): string => {
    if (!user || url.startsWith('/')) return url

    const obj = new URL(url)
    const sp = obj.searchParams

    sp.set('token', user?.token || '')
    sp.set('theme', resolvedTheme || 'light')
    if (sp.has('secretId')) sp.set('secretId', user?.secretId || '')
    if (sp.has('loginName')) sp.set('loginName', user?.name || '')

    return obj.toString()
  }

  if (user) {
    for (const key in moduleLinks) {
      replacedLinks[key] = {
        ...moduleLinks[key],
        url: replaceVariables(moduleLinks[key].url)
      }
    }
    return replacedLinks
  } else {
    return moduleLinks
  }
}
