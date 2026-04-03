'use client'

import { createFileRoute } from '@tanstack/react-router'
import { menuData, MenuItem } from '@renderer/config/menu'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { useTheme } from 'next-themes'
import { JSX } from 'react'

export function NavigationMenuDemo(): JSX.Element {
  const { user } = useAuthHook()
  const { resolvedTheme } = useTheme()

  const handleLinkClick = (event, url?: string): void => {
    event.preventDefault()

    if (!user || !url) return

    const replacedUrl = replaceVariables(url)
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.invoke('menu:onclick', replacedUrl)
    } else {
      console.warn('Electron IPC renderer not available.')
      // Optional: Fallback or handle this case if not running in Electron
      // window.location.href = url; // Example fallback: navigate directly
    }
  }

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

  // Helper function to render menu items recursively
  const renderMenuItems = (items: MenuItem[]): JSX.Element => {
    return (
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.title}>
            {item.url ? (
              // If item has a URL, it's a clickable link
              <a
                href={item.url}
                className="text-sm text-muted-foreground hover:underline"
                onClick={(e) => handleLinkClick(e, item.url)}
              >
                {item.title}
              </a>
            ) : (
              // If item has children, it's a category title
              <>
                <h5 className="font-medium">{item.title}</h5>
                {item.children && item.children.length > 0 && (
                  <ul className="ml-4 space-y-1">{renderMenuItems(item.children)}</ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div id="menu" className="flex justify-around gap-8 p-4">
      {menuData.map((category) => (
        <div key={category.title} className="flex-1">
          <h4 className="font-bold mb-2">{category.title}</h4>
          {category.children && category.children.length > 0 && renderMenuItems(category.children)}
        </div>
      ))}
    </div>
  )
}

export const Route = createFileRoute('/_layouts/nav-menu')({
  component: NavigationMenuDemo
})
