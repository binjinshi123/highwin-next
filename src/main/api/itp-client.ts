import { URLs } from '@shared/config/url-config'
import { toTypeId } from '@shared/security-utils'
import { HwSecurity, PlateType } from '@shared/types'
import { ItpSecurity, SearchResultSchema } from '@shared/schemas/itp-schema'
import { plateIdMap } from '@shared/config/plate-config'

const baseSearch = async (
  query: string,
  plateIds: number[],
  markets: string[] = ['SZSE', 'SSE', 'BSE'],
  pageSize: number = 10
): Promise<ItpSecurity[]> => {
  if (!query) return []

  const plateIdString = plateIds.join(',')
  const marketString = markets.join(',')
  const api = `${URLs.itp.apiBase}/QuotationAPI/api/v1/static/security/plate/${plateIdString}?searchString=${query}&markets=${marketString}&pageSize=${pageSize}`
  const response = await fetch(api)
  const result = await response.json()
  const parsed = SearchResultSchema.safeParse(result)

  if (!parsed.success) {
    throw new Error(parsed.error.message)
  }

  return parsed.data.data
}

export const searchSecurities = async (
  query: string,
  types: PlateType[]
): Promise<HwSecurity[]> => {
  if (!query) return []
  if (types.length == 0) return []

  const plateIds = types.flatMap((type) => plateIdMap[type])
  const result = await baseSearch(query, plateIds)
  const securities: HwSecurity[] = result.map(
    (s): HwSecurity => ({
      SecurityID: s.securityid,
      Symbol: s.symbol,
      ShortName: s.shortname,
      ExchangeCode: s.market,
      TypeID: toTypeId(s.securitytype),
      MarketType: toDescription(s.securitytype)
    })
  )
  console.log('searchSecurities', query, types.join(','), securities.length)
  return securities
}

const toDescription = (securityType: number): string => {
  switch (securityType) {
    case 1:
    case 19:
    case 21:
      return '股票'
    case 2:
      return '基金'
    case 3:
      return '债券'
    case 4:
      return '指数'
    default:
      return ''
  }
}
