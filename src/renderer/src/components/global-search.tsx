import { JSX, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '@renderer/components/ui/input'
import { Security } from '@shared/types'
import { cn, escapeRegExp } from '@renderer/lib/utils'
import { useSearchStore } from '@renderer/store/useSearchStore'
import { useRecentSecurities } from '@renderer/hooks/useRecentSymbols'
import { debounce } from 'lodash'
import { searchSymbols } from '@renderer/api/itp-client'

export function GlobalSearchPage(): JSX.Element {
  const [query, setQuery] = useState('')
  const [rowIndex, setRowIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)

  const searchResult = useSearchStore((s) => s.searchResult)
  const setSearchResult = useSearchStore((s) => s.setSearchResult)
  const { recentSecurities, add: addRecentSecurity } = useRecentSecurities()

  const recentSecuritiesRef = useRef(recentSecurities)
  useEffect(() => {
    recentSecuritiesRef.current = recentSecurities
  }, [recentSecurities])

  const handleSymbolClick = (s: Security): void => {
    if (window.electron) {
      window.electron.ipcRenderer.send('on-security-select', s)
    }
    addRecentSecurity(s)
  }

  const highlightText = (text: string, highlight: string): ReactNode => {
    if (!highlight) return text
    const safeHighlight = escapeRegExp(highlight)
    const parts = text.split(new RegExp(`(${safeHighlight})`, 'gi'))
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="text-primary">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    )
  }

  // 只在 query 停止变化 300ms 后才触发搜索
  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      let result: Security[] = []
      if (q) {
        result = await searchSymbols(q)
      } else {
        result = recentSecuritiesRef.current
      }
      setSearchResult(result)
      setRowIndex(result.length > 0 ? 0 : -1)
    }, 300),
    []
  )

  useEffect(() => {
    // 监听主进程发送的初始查询
    if (window.electron) {
      const offFn = window.electron.ipcRenderer.on('set-initial-query', (_, initialQuery) => {
        setQuery(initialQuery)
        inputRef.current?.focus()
      })
      return () => {
        offFn()
      }
    }
    return () => {}
  }, [])

  // useEffect(() => {
  //   if (rowIndex === 0) {
  //     inputRef.current?.focus()
  //   }
  // }, [rowIndex])

  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, debouncedSearch])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowDown') {
        if (rowIndex >= searchResult.length - 1) return
        const newIndex = rowIndex + 1
        setRowIndex(newIndex)
      } else if (event.key === 'ArrowUp') {
        if (rowIndex < 1) return
        const newIndex = rowIndex - 1
        setRowIndex(newIndex)
      } else if (event.key === 'Enter') {
        const selected = searchResult[rowIndex]
        handleSymbolClick(selected)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchResult, rowIndex])

  return (
    <div className="w-full h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">代码搜索</h2>
        <Input
          ref={inputRef}
          placeholder="股票代码或拼音首字母"
          value={query}
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault()
            }
          }}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="max-h-96 mt-4 overflow-y-auto">
          {searchResult.map((security, index) => (
            <div
              key={security.securityid}
              onClick={() => handleSymbolClick(security)}
              className={cn(
                'flex items-center gap-8 p-1 border-b hover:bg-accent',
                rowIndex === index ? 'bg-accent text-accent-foreground' : ''
              )}
            >
              <span className="w-10">{highlightText(security.symbol, query)}</span>
              <span className="flex-1">{highlightText(security.shortname, query)}</span>
              <span className="w-10 text-right">{security.market}</span>
            </div>
          ))}
        </div>
        {/* <div className='text-muted-foreground text-sm mt-4'>直接输入股票代码或拼音首字母即可调出此搜索框</div> */}
      </div>
    </div>
  )
}
