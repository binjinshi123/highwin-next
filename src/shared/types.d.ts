/**
 * JSend is a specification for a simple, no-frills, JSON based format for application-level communication.
 * See https://github.com/omniti-labs/jsend
 */
export type JSend = {
  status: 'success' | 'fail' | 'error'
  data?: any
  message?: string // 错误消息
  code?: string
}

export interface Security {
  securityid: number
  symbol: string
  shortname: string
  market: string
  securityType: number
}

export interface UserInfo {
  id: number
  name: string
  token: string
  secretId?: string
  expireDate?: string
}

/** 红楹前端使用的证券数据 */
export interface HwSecurity {
  SecurityID: number
  Symbol: string
  ExchangeCode: string
  TypeID: string
  ShortName: string
  MarketType: string
}

export type PlateType = 'stock' | 'bond' | 'fund' | 'index'

export interface Plate {
  id: number
  name: string
  type: PlateType
}
