import { create } from 'zustand'
import { L1Tick } from '@renderer/types/quote'

interface QuoteDataState {
  rowsData: L1Tick[]
  rowCount: number
  initialize: (data: L1Tick[]) => void
  patch: (data: L1Tick) => void
  clear: () => void
  setRowCount: (num: number) => void
}

export const useTableStore = create<QuoteDataState>((set) => ({
  rowsData: [],
  rowCount: 0,
  initialize: (data: L1Tick[]) => set({ rowsData: data }),
  patch: (data) =>
    set((state) => {
      const newData = [...state.rowsData]
      const index = newData.findIndex((item) => item.sid === data.sid)
      if (index !== -1) {
        newData[index] = data
      } else {
        console.log('patch data not found', data)
      }
      return {
        rowsData: newData
      }
    }),
  clear: () => set({ rowsData: [] }),
  setRowCount: (num: number) => set({ rowCount: num })
}))
