'use client'

import { GlobalSearchPage } from '@renderer/components/global-search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layouts/global-search')({
  component: GlobalSearchPage
})
