import { toTypeId } from '@shared/security-utils'

const f9Map = new Map<string, string>([
  // ['S0101', 'multidata/deepdata/stock'],
  ['S0102', 'multidata/deepdata/bond'],
  ['S0103', 'multidata/deepdata/foundation'],
  ['S0104', 'multidata/deepdata/index'],
  ['S0107', 'multidata/deepdata/futures/futuresCommodity'],
  ['S0108', 'multidata/deepdata/futures/futuresStockindex'],
  ['S0109', 'multidata/deepdata/futures/futuresTreasurybond'],
  ['S0114', 'multidata/deepdata/option/optionStockoption'],
  ['S0115', 'multidata/deepdata/option/optionStockindex'],
  ['S0116', 'multidata/deepdata/option/optionCommodity']
])

export function getF9Url(
  f9Baseurl: string,
  symbolMarket: string,
  shortName: string,
  securityType: number | string
): string {
  let url = f9Baseurl
  const typeId = typeof securityType === 'string' ? securityType : toTypeId(securityType)
  if (f9Map.has(typeId)) {
    const defaultSeg = 'multidata/deepdata/stock'
    const replaceSeg = f9Map.get(typeId)!
    url = f9Baseurl.replace(defaultSeg, replaceSeg)
  }

  // 上证指数通转换为对应的普通指数
  // 000001z.SSE => 000001.SSE
  if (typeId === 'S0104') {
    const isSSEPress = symbolMarket.endsWith('z.SSE')
    if (isSSEPress) {
      symbolMarket = symbolMarket.replace('z.SSE', '.SSE')
    }
  }

  const hwSymbol = `${symbolMarket}.${shortName}.${typeId}`
  url += `&symbol=${encodeURIComponent(hwSymbol)}`

  return url
}
