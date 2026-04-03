import { useEffect, useRef } from 'react'

export function useMarketReset(task: () => void, hour = 9, minute = 6): void {
  const taskRef = useRef(task)
  taskRef.current = task

  useEffect(() => {
    function getNextTriggerTime(): number {
      const now = new Date()
      const next = new Date()
      next.setHours(hour, minute, 0, 0)
      if (now >= next) next.setDate(next.getDate() + 1)
      return next.getTime() - now.getTime()
    }

    let intervalId: NodeJS.Timeout
    const timeoutId = setTimeout(() => {
      taskRef.current()
      intervalId = setInterval(
        () => {
          taskRef.current()
        },
        24 * 60 * 60 * 1000
      )
    }, getNextTriggerTime())

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [hour, minute])
}
