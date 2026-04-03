import { HubConnectionState } from '@microsoft/signalr'
import { itpSocket } from '@renderer/lib/signalrManager'
import { cn } from '@renderer/lib/utils'
import { Wifi, WifiOff } from 'lucide-react'
import { JSX, useEffect, useState } from 'react'

export function ConnectState({ className }: { className?: string }): JSX.Element {
  const [state, setState] = useState<HubConnectionState | null>(null)

  useEffect(() => {
    const handleStateChange = (newState: HubConnectionState): void => {
      setState(newState)
    }

    itpSocket.subscribe(handleStateChange)

    return () => {
      itpSocket.unsubscribe(handleStateChange)
    }
  }, [itpSocket])

  const connected = state === HubConnectionState.Connected
  const WifiIcon = connected ? Wifi : WifiOff
  const iconClassName = connected ? 'text-green-700 animate-pulse' : 'text-destructive'
  return (
    <div className={cn('px-1', className)}>
      <WifiIcon size={18} className={cn('', iconClassName)} />
    </div>
  )
}
