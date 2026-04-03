import { IndustrySchema, TradeMinutesSchema } from '@renderer/schemas/itp-schemas'
import { plateIdMap } from '@shared/config/plate-config'
import { URLs } from '@shared/config/url-config'
import { SearchResultSchema } from '@shared/schemas/itp-schema'
import { Plate, Security } from '@shared/types'
import log from 'electron-log/renderer'
import ky from 'ky'

const itpAPI = ky.create({
  prefixUrl: URLs.itp.apiBase
})

export const searchSymbols = async (query: string, plateIds?: number[]): Promise<Security[]> => {
  const finalPlateIds = plateIds ?? Object.values(plateIdMap).flat()
  const plateIdString = finalPlateIds.join(',')

  try {
    const response = await itpAPI(`QuotationAPI/api/v1/static/security/plate/${plateIdString}`, {
      searchParams: {
        searchString: query,
        markets: 'SZSE,SSE,BSE',
        pageSize: 10
      }
    }).json()

    const parsed = SearchResultSchema.safeParse(response)
    if (!parsed.success) {
      throw new Error(parsed.error.message)
    }

    return parsed.data.data.map(
      (s): Security => ({
        securityid: s.securityid,
        symbol: s.symbol,
        shortname: s.shortname,
        market: s.market,
        securityType: s.securitytype
      })
    )
  } catch (error) {
    log.error(error)
    return []
  }
}

export const getTradeMinutes = async (symbol: string, exchange: string): Promise<string[]> => {
  const data = await itpAPI('QuotationAPI/api/v1/Calendar/GetEmptyQuoteList', {
    searchParams: {
      symbol: symbol,
      exchangeCode: exchange
    }
  }).json()

  const parsed = TradeMinutesSchema.safeParse(data)

  if (!parsed.success) throw new Error(parsed.error.message)

  const parsedData = parsed.data

  if (parsedData.isok) {
    return parsedData.data
  } else {
    console.error(parsedData.msg)
    return []
  }
}

export const getIndustries = async (): Promise<Plate[]> => {
  const data = await itpAPI('VERace/PlateTree/SearchIndustryList').json()
  const parsed = IndustrySchema.safeParse(data)

  if (!parsed.success) throw new Error(parsed.error.message)

  const parsedData = parsed.data

  if (parsedData.isOK) {
    return parsedData.data.map((plate) => ({
      id: plate.plateID,
      name: plate.plateName,
      type: 'stock'
    }))
  } else {
    console.error(parsedData.msg)
    return []
  }
}
