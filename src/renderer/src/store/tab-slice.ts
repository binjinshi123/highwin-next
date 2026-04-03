import { TabsSlice } from '@renderer/types/tab-slice'
import { TabInfo } from '@renderer/types/tabs'
import { produce } from 'immer'
import { StateCreator } from 'zustand'

const defaultTitle = '新标签页'

export const createTabSlice: StateCreator<TabsSlice, [], [], TabsSlice> = (set) => ({
  tabs: {
    items: [
      {
        id: 0,
        title: defaultTitle
      }
    ],
    selectedTabId: 0,
    selectedTabIndex: 0,
    initialize: async () => {
      const ids = await window.tabs.getAllTabIds()
      if (ids.length === 0) {
        return
      }
      const selectedTabId = await window.tabs.getSelectedTabId()
      set(
        produce((state: TabsSlice) => {
          state.tabs.items = ids.map((id) => ({
            id,
            title: defaultTitle
          }))

          state.tabs.selectedTabId = selectedTabId === -1 ? ids[0] : selectedTabId

          state.tabs.selectedTabIndex = state.tabs.items.findIndex(
            (tab) => state.tabs.selectedTabId === tab.id
          )
        })
      )
    },
    setSelectedTab: (tab: TabInfo) => {
      window.tabs.select(tab.id)
      set(
        produce((state: TabsSlice) => {
          state.tabs.selectedTabId = tab.id
          state.tabs.selectedTabIndex = state.tabs.items.findIndex((item) => tab.id === item.id)
        })
      )
    },
    remove: (tab: TabInfo) =>
      set(
        produce((state: TabsSlice) => {
          if (state.tabs.items.length === 1) {
            // If we are deleting the last tab, close it and add a new tab
            state.tabs.items.splice(0, 1)
            window.tabs.close(tab.id)
            state.tabs.add()
            return
          }
          const index = state.tabs.items.findIndex((t) => t.id === tab.id)

          if (tab.id === state.tabs.selectedTabId) {
            // Set new selected tab if the current tab is selected
            if (index === -1) {
              state.tabs.selectedTabId = state.tabs.items[0].id
            } else if (index === state.tabs.items.length - 1) {
              state.tabs.selectedTabId = state.tabs.items[state.tabs.items.length - 2].id
            } else {
              state.tabs.selectedTabId = state.tabs.items[index + 1].id
            }
          }

          if (index === -1) return
          window.tabs.select(state.tabs.selectedTabId)
          state.tabs.items.splice(index, 1)
          window.tabs.close(tab.id)
        })
      ),
    add: async () => {
      const id = await window.tabs.new()
      if (id === -1) return

      set(
        produce((state: TabsSlice) => {
          state.tabs.items.push({
            id,
            title: defaultTitle,
            url: '/'
          })
          state.tabs.selectedTabId = id
          state.tabs.selectedTabIndex = state.tabs.items.length - 1
        })
      )
    },
    reorder: (tabs: TabInfo[]) => {
      window.tabs.reorder(tabs.map((tab) => tab.id))
      set(
        produce((state: TabsSlice) => {
          state.tabs.items = tabs
          state.tabs.selectedTabIndex = tabs.findIndex((tab) => state.tabs.selectedTabId === tab.id)
        })
      )
    },
    updateTitle: (tabId: number, title: string) => {
      console.trace('tab-slice.ts updateTitle', tabId, title)
      set(
        produce((state: TabsSlice) => {
          const tab = state.tabs.items.find((tab) => tab.id === tabId)
          if (tab) {
            tab.title = title // Immer 会自动处理不可变性
          } else {
            console.error('tab not found', tabId, title)
          }
        })
      )
    },
    openInNewTab: async (tab: TabInfo) => {
      console.debug('tab-slice.ts openInNewTab', tab)
      set(
        produce((state: TabsSlice) => {
          state.tabs.items.push({
            id: tab.id,
            title: tab.title ?? defaultTitle,
            url: tab.url
          })
          state.tabs.selectedTabId = tab.id
          state.tabs.selectedTabIndex = state.tabs.items.length - 1
        })
      )
    },
    onCloseAll: () => {
      set(
        produce((state: TabsSlice) => {
          state.tabs.items = []
          state.tabs.selectedTabIndex = -1
        })
      )
    }
  }
})
