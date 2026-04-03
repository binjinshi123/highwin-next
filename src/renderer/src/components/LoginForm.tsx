import { ComponentPropsWithoutRef, FormEvent, JSX, useEffect, useState } from 'react'
import { cn } from '@renderer/lib/utils'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useRouterState } from '@tanstack/react-router'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { Eye, EyeClosed } from 'lucide-react'
import AccountSelect from './CreatableEditableSelect'
import { URLs } from '@shared/config/url-config'
import { UserInfo } from '@shared/types'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from '@renderer/components/ui/alert-dialog'

// 工具函数：管理本地用户名密码列表
function getSavedAccounts(): { username: string; password: string; isRemember: boolean }[] {
  const data = localStorage.getItem('accounts')
  return data ? JSON.parse(data) : []
}

function saveAccount(username: string, password: string, isRemember: boolean): void {
  let accounts = getSavedAccounts()
  // 去重，最新的放前面
  accounts = accounts.filter((acc) => acc.username !== username)
  accounts.unshift({ username, password: isRemember ? password : '', isRemember })
  localStorage.setItem('accounts', JSON.stringify(accounts))
}

export const LoginForm = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'form'>): JSX.Element => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  //const [remember, setRemember] = useState(false)
  const [remember, setRemember] = useState((): boolean => {
    // 尝试从本地存储读取 remember 的值
    const stored = localStorage.getItem('remember')
    return stored === 'true' // 转换为布尔值
  })
  const [showPassword, setShowPassword] = useState(false)
  const [accounts, setAccounts] = useState<
    { username: string; password: string; isRemember: boolean }[]
  >([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isLoading = useRouterState({ select: (s): boolean => s.isLoading })
  const isLoggingIn = isLoading || isSubmitting

  const { login } = useAuthHook()

  useEffect(() => {
    // 读取本地保存的信息
    const savedAccounts = getSavedAccounts()
    setAccounts(savedAccounts)

    if (savedAccounts.length > 0) {
      setUsername(savedAccounts[0].username)
      setPassword(savedAccounts[0].password)
      setRemember(savedAccounts[0].isRemember)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      event.preventDefault()
      // 新增：用户名和密码必填校验
      if (!username.trim() && !password.trim()) {
        setErrorMessage('请输入用户名和密码')
        setIsSubmitting(false)
        return
      }
      if (!username.trim()) {
        setErrorMessage('请输入用户名')
        setIsSubmitting(false)
        return
      }
      if (!password.trim()) {
        setErrorMessage('请输入密码')
        setIsSubmitting(false)
        return
      }

      const response = await login(username, password)

      if (response.status === 'success') {
        saveAccount(username, password, remember)
        setAccounts(getSavedAccounts())

        const user = response.data as UserInfo
        const url = URLs.llm.chat
          .replace('$token', user?.token ?? '')
          .replace('$userId', user?.id.toString() ?? '')
          .replace('$secretId', user?.secretId ?? '')

        if (response.message) {
          setAlertMessage(response.message)
          setShowAlert(true)
          setPendingUrl(url)
          return
        }

        window.location.replace(url)
        // await navigate({ to: url, replace: true })
      } else {
        setErrorMessage(`${response.message}`)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('An unexpected error occurred. Please try again later.')
      setIsSubmitting(false)
    }
  }

  const handleAlertDialogChange = (open: boolean): void => {
    setShowAlert(open)
    if (!open && pendingUrl) {
      window.location.replace(pendingUrl)
    }
  }

  return (
    <>
      <form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={handleSubmit}>
        {errorMessage && <div className="text-destructive text-sm text-left">{errorMessage}</div>}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <AccountSelect
              accounts={accounts}
              value={username}
              onInputChange={(inputValue) => {
                // 只在用户输入时更新
                setUsername(inputValue)
                const found = accounts.find((acc) => acc.username === inputValue)
                if (found) {
                  setPassword(found.password)
                  setRemember(found.isRemember)
                } else {
                  setPassword('')
                  setRemember(false)
                }
                return inputValue
              }}
              onChange={(name) => {
                setUsername(name)
                const found = accounts.find((acc) => acc.username === name)
                if (found) {
                  setPassword(found.password)
                  setRemember(found.isRemember)
                } else {
                  setPassword('')
                  setRemember(false)
                }
              }}
            />
          </div>
          <div className="grid gap-2 relative">
            <div className="flex items-center">
              <Label htmlFor="password">密码</Label>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-10 -translate-y-1/2 flex items-center text-gray-400"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
            >
              {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => {
                setRemember(e.target.checked)
                localStorage.setItem('remember', String(e.target.checked))
              }}
            />
            <Label htmlFor="remember" className="text-xs">
              记住密码
            </Label>
          </div>
          <Button type="submit" className="w-full">
            {isLoggingIn ? '登录中...' : '登录'}
          </Button>
        </div>
      </form>
      <AlertDialog open={showAlert} onOpenChange={handleAlertDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提示</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
