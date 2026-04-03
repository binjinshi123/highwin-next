import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@renderer/components/ui/context-menu'
import { cn, openInNewTab } from '@renderer/lib/utils'
import { ExternalLink } from 'lucide-react'
import { useModuleLinks } from '@renderer/hooks/useModuleLinks'
import { ModuleLink } from '@renderer/config/module-config'

export function ModuleNavigation() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const modules = useModuleLinks()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {Object.entries(modules).map(([key, module]) => (
        <ContextMenu key={key}>
          <ContextMenuTrigger>
            <ModuleCard
              module={module}
              isHovered={hoveredId === module.title}
              onHover={() => setHoveredId(module.title)}
              onLeave={() => setHoveredId(null)}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => openInNewTab(module.url, module.title)}>
              <ExternalLink className="mr-2 size-4" />
              <span>在新标签页中打开</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  )
}

interface ModuleCardProps {
  module: ModuleLink
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

const ModuleCard = ({ module, isHovered, onHover, onLeave }: ModuleCardProps) => {
  const Icon = module.icon

  return (
    <Link to={module.url} preload={false} className="block h-full">
      <div
        className={cn(
          'relative rounded-lg shadow-xs transition-colors duration-200 border',
          isHovered ? 'bg-accent border-accent-foreground/20' : 'bg-card border-border'
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="relative h-full flex flex-col p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={cn(
                  'p-2 rounded-md',
                  isHovered
                    ? 'bg-accent-foreground/10 text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="size-5" />
              </div>
              <h3 className="ml-2 text-lg font-medium text-card-foreground">{module.title}</h3>
            </div>
            <div
              className={cn(
                'transition-opacity duration-200',
                isHovered ? 'opacity-100 text-accent-foreground' : 'opacity-0'
              )}
            >
              <ExternalLink className="size-4" />
            </div>
          </div>

          {module.description && (
            <p
              className={cn(
                'h-10 text-sm mt-3 text-left transition-opacity duration-200',
                isHovered ? 'text-accent-foreground/90' : 'text-muted-foreground'
              )}
            >
              {module.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
