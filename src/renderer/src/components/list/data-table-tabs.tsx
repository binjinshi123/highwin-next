import { plateList } from '@renderer/config/plate-config'
import { JSX } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@renderer/components/ui/navigation-menu'
import { RadioGroup, RadioGroupItem } from '@renderer/components/ui/radio-group'
import { Label } from '@renderer/components/ui/label'
import { InlineSecuritySearch } from '../inline-security-search'
import { DataTableFilterIndustry } from './data-table-filter-industry'
import { Plate, Security } from '@shared/types'

interface PlateTabsProps {
  selectedPlate: Plate
  onPlateChange?: (newValue: Plate) => void
  industryId?: number
  onIndustryChange?: (newValue: number | undefined) => void
  security?: Security
  onSecurityChange?: (newValue: Security | undefined) => void
}

export function PlateTabs({
  selectedPlate,
  industryId,
  onIndustryChange,
  onPlateChange,
  security,
  onSecurityChange
}: PlateTabsProps): JSX.Element {
  const onValueChange = (plateId: string): void => {
    if (onPlateChange) {
      const found = plateList
        .flatMap((item) => item.plates)
        .find((plate) => plate.id.toString() === plateId)
      if (found) {
        onPlateChange(found)
      }
    }
  }

  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 px-2">
      <div className="flex-shrink-0 flex gap-2">
        <div className="px-3 w-24 py-2 bg-accent text-sm text-accent-foreground rounded">
          {selectedPlate.name}
        </div>
        <NavigationMenu viewport={false} className="z-11">
          <NavigationMenuList>
            {plateList.map((item) => (
              <NavigationMenuItem key={item.type}>
                <NavigationMenuTrigger
                  className={selectedPlate.type === item.type ? 'bg-accent/50' : ''}
                >
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <RadioGroup
                    className="text-sm w-26 gap-0"
                    value={selectedPlate.id.toString()}
                    onValueChange={onValueChange}
                  >
                    {item.plates.map((plate) => (
                      <div
                        key={plate.id}
                        className="flex items-center gap-2 pl-1 py-2 rounded hover:bg-accent/50"
                      >
                        <RadioGroupItem value={plate.id.toString()} id={plate.id.toString()} />
                        <Label htmlFor={plate.id.toString()} className="font-normal">
                          {plate.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex-shrink-0 flex items-center justify-end gap-4">
        {selectedPlate.type === 'stock' && (
          <DataTableFilterIndustry
            value={industryId}
            onValueChange={onIndustryChange}
            className="hidden md:flex"
          />
        )}
        <InlineSecuritySearch
          plateIds={[selectedPlate.id]}
          value={security}
          onValueChange={onSecurityChange}
          className="hidden sm:inline"
        />
      </div>
    </div>
  )
}
