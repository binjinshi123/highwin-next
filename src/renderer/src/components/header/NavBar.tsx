import { cn } from '@renderer/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { JSX, useEffect, useState } from 'react'

const NavBar = ({ className }: { className?: string }): JSX.Element => {
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  const handleBack = async (): Promise<void> => {
    await window.nav.goBack()
  }

  const handleForward = async (): Promise<void> => {
    await window.nav.goForward()
  }

  useEffect(() => {
    const checkHistory = async (): Promise<void> => {
      const back = await window.nav.canGoBack()
      const forward = await window.nav.canGoForward()
      setCanGoBack(back)
      setCanGoForward(forward)
    }

    window.nav.onNavigationUpdate(() => {
      checkHistory()
    })

    checkHistory()
  }, [])

  return (
    <div className={cn('h-full flex items-stretch', className)}>
      <motion.button
        className={cn(
          'w-8 flex items-center justify-center',
          canGoBack ? 'text-foreground' : 'text-foreground/30 cursor-not-allowed'
        )}
        onClick={handleBack}
        whileHover={{ scale: 1.1 }}
        disabled={!canGoBack}
      >
        <ArrowLeft strokeWidth={1} />
      </motion.button>
      <motion.button
        className={cn(
          'w-8 flex items-center justify-center',
          canGoForward ? 'text-foreground' : 'text-foreground/30 cursor-not-allowed'
        )}
        onClick={handleForward}
        whileHover={{ scale: 1.1 }}
        disabled={!canGoForward}
      >
        <ArrowRight strokeWidth={1} />
      </motion.button>
    </div>
  )
}

export default NavBar
