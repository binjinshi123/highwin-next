import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@renderer/lib/utils'
import { useWatchlist } from '@renderer/hooks/useWatchlist'
import { Button } from '@renderer/components/ui/button'

interface AddToWatchlistProps {
  symbol: string
  className?: string
}

export function AddToWatchlist({ symbol, className }: AddToWatchlistProps) {
  const { exists: isInWatchlist, add: addSymbol, del: delSymbol } = useWatchlist()

  const handleClick = async () => {
    if (isInWatchlist(symbol)) {
      const result = await delSymbol(symbol)
      if (result.status === 'success') {
        toast.success('已移出自选')
      } else {
        toast.error(result.message ?? '删自选失败')
      }
    } else {
      const result = await addSymbol(symbol)
      if (result.status === 'success') {
        toast.success('已加入自选')
      } else {
        toast.error(result.message ?? '加自选失败')
      }
    }
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleClick}
      className={cn('bg-transparent hover:bg-accent rounded transition-colors', className)}
    >
      <Heart className={cn('size-5', isInWatchlist(symbol) ? 'fill-current' : 'fill-none')} />
    </Button>
  )
}
