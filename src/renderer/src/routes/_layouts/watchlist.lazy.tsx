'use client'

import Watchlist from '@renderer/components/watchlist/watchlist'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layouts/watchlist')({
  component: Watchlist
})
