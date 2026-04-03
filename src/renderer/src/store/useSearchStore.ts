import { create } from 'zustand'
import { Security } from '@shared/types'

interface SearchState {
  searchResult: Security[]
  setSearchResult: (symbols: Security[]) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
  searchResult: [],
  setSearchResult: (symbols) => set({ searchResult: symbols })
}))
