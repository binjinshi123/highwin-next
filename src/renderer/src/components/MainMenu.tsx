import { Keyboard, Settings, User, Info } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'

import { useNavigate } from '@tanstack/react-router'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { JSX } from 'react'

export function MainMenu(): JSX.Element {
  const navigate = useNavigate()
  const { user } = useAuthHook()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {user ? (
            <Avatar>
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <User />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-center">
          {user ? user.name : 'My Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <Settings />
            <span>设置</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Keyboard />
            <span>快捷键</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: '/about' })}>
            <Info />
            <span>关于</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
