import { TabInfo } from '@renderer/types/tabs'
import { cn } from '@renderer/lib/utils'
import { motion, Reorder } from 'motion/react'
import { X } from 'lucide-react'
import { Separator } from '@renderer/components/ui/separator'
import { JSX } from 'react'

interface Props {
  item: TabInfo
  isSelected: boolean
  showSeparator: boolean
  onClick: () => void
  onRemove: () => void
}

export const Tab = ({ item, onClick, onRemove, isSelected, showSeparator }: Props): JSX.Element => {
  return (
    <Reorder.Item
      value={item}
      id={item.id}
      initial={{
        opacity: 1,
        y: 30
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.1, ease: 'easeInOut' }
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
      whileDrag={{
        transition: { ease: 'easeInOut' }
      }}
      className={cn(
        isSelected
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'bg-sidebar-background hover:bg-sidebar-accent/50',
        'titlebar-button max-w-52',
        `w-full relative h-[35px] flex justify-between items-center
        flex-1 overflow-hidden select-none`
      )}
      onPointerDown={onClick}
    >
      <motion.span
        // This is a hack to make the text fade out nicely when close to edge.
        style={{
          maskImage: 'linear-gradient(to left, transparent 30px, #fff 60px)',
          WebkitMaskImage: 'linear-gradient(to left, transparent 30px, #fff 60px)'
        }}
        className={cn(
          `text-xs pl-[10px] shrink grow leading-[18px] whitespace-nowrap block
          min-w-0 pr-[10px]`,
          isSelected ? '' : ''
        )}
        layout="position"
      >{`${item.title}`}</motion.span>
      <motion.div
        layout
        className="absolute top-0 bottom-0 right-[0px] flex align-center items-center justify-end
          shrink-0"
      >
        {item.title !== '智能助手' && (
          <motion.button
            onPointerDown={(event) => {
              event.stopPropagation()
              onRemove()
            }}
            initial={false}
            animate={{
              scale: 0.9
            }}
          >
            <X
              size={14}
              className={cn(
                'rounded-full transition-all duration-300',
                isSelected ? 'hover:bg-sidebar' : 'hover:bg-sidebar-accent'
              )}
            />
          </motion.button>
        )}

        <Separator
          orientation="vertical"
          className={cn(
            isSelected || !showSeparator ? 'invisible' : 'visible',
            'bg-sidebar-border h-5 ml-2'
          )}
        />
      </motion.div>
    </Reorder.Item>
  )
}
