import { useBoundStore } from '@renderer/store/useBoundStore'
import { AnimatePresence, Reorder } from 'motion/react'
import { Tab } from './Tab'
import { JSX, useEffect } from 'react'

export default function TabBar(): JSX.Element {
  const tabs = useBoundStore((state) => state.tabs.items)
  const setSelectedTab = useBoundStore((state) => state.tabs.setSelectedTab)
  const remove = useBoundStore((state) => state.tabs.remove)
  // const add = useBoundStore((state) => state.tabs.add)
  const setTabs = useBoundStore((state) => state.tabs.reorder)
  const onCloseAll = useBoundStore((state) => state.tabs.onCloseAll)
  const selectedTabId = useBoundStore((state) => state.tabs.selectedTabId)
  const selectedTabIndex = useBoundStore((state) => state.tabs.selectedTabIndex)
  const updateTitle = useBoundStore((state) => state.tabs.updateTitle)
  const openInNewTab = useBoundStore((state) => state.tabs.openInNewTab)

  useEffect(() => {
    const handleTitleUpdate = (tabId: number, title: string): void => {
      updateTitle(tabId, title)
    }
    window.tabs.onTitleUpdated(handleTitleUpdate)

    const handleOpenInNewTab = (id: number, url: string, title?: string): void => {
      openInNewTab({ id, url, title })
    }
    window.tabs.onOpenInNewTab(handleOpenInNewTab)

    window.tabs.onCloseAll(onCloseAll)

    return () => {
      // 清理监听器
      window.tabs.onTitleUpdated(() => {})
      window.tabs.onOpenInNewTab(() => {})
      window.tabs.onCloseAll(() => {})
    }
  }, [updateTitle, openInNewTab])

  return (
    <div className="flex flex-row w-full grow">
      <Reorder.Group
        as="ul"
        axis="x"
        onReorder={setTabs}
        className="grow flex-nowrap flex justify-start items-center pr-10 w-[300px]"
        values={tabs}
      >
        <AnimatePresence initial={false}>
          {tabs.map((item, index) => (
            <Tab
              key={item.id}
              item={item}
              isSelected={selectedTabId === item.id}
              onClick={() => setSelectedTab(item)}
              onRemove={() => remove(item)}
              showSeparator={index !== selectedTabIndex - 1 && tabs.length > 2}
            />
          ))}
          {/* <motion.button
            className="titlebar-button flex items-center justify-center hover:bg-accent
              rounded-full h-7 w-7 transition-all duration-300 ml-2"
            onClick={add}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={20} strokeWidth={1.3} />
          </motion.button> */}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}
