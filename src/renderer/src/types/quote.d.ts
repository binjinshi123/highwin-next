export interface L1Min {
  /** UTC时间戳 */
  utc: string
  /** 收盘价(close price) */
  cp: number
  /** 涨跌幅(change rate) */
  cr: number
  /** 涨跌(price change) */
  pc: number
  /** 昨收 */
  pp: number
  /** 均价(average price) */
  avg: number
  /** 证券ID(security id) */
  sid: number
  /** 市场代码(market) */
  mk: string
  /** 证券代码(symbol) */
  sm: string
  /** 证券名称(security name) */
  sn: string
  /** 均价(volume price) */
  vp: number
  /** 总额(total amount) */
  ta: number
  /** 总量(total volume) */
  tv: number
  /** 昨结(last close price) */
  lcp?: number
  /** 交易日期 */
  tradingDate: number
  /** 板块ID */
  bid: string
}

export interface KLineData {
  kData: {
    /** 时间 */
    utc: string
    /** 开 */
    op: number
    /** 高 */
    hp: number
    /** 低 */
    lp: number
    /** 收 */
    cp: number
    /** 总量 */
    tv: number
    /** 记录从数据库中查询出来的总量TV */
    oldTV: number
    /** 总额 */
    ta: number
    /** 涨幅 */
    cr: number
    /** 涨跌 */
    cg: number
    /** 市场 */
    mk: string
    /** 名称 */
    sn: string
    /** 代码 */
    sm: string
    /** ID */
    sid: number
  }
  kIndex: {
    /** K */
    K: number
    /** D */
    D: number
    /** J */
    J: number
    /** DIF */
    DIF: number
    /** DEA */
    DEA: number
    /** MACD */
    MACD: number
    /** RSI6 */
    RSI6: number
    /** RSI12 */
    RSI12: number
    /** RSI24 */
    RSI24: number
  }
}

/**
 * 对应 TickQuotationcs
 */
export interface L1Tick {
  /** 证券ID */
  sid: number
  /** 市场 */
  mk: string
  /** 代码 */
  sm: string
  /** 证券简称 */
  sn: string
  /** 收盘价 */
  cp: number
  /** 涨跌幅 */
  cr: number
  /** 涨跌 */
  cg: number
  /** 振幅 */
  at: number
  /** 买价 */
  bp: number
  /** 卖价 */
  sp: number
  /** 换手率 */
  tr: number
  /** 成交量 */
  tq: number
  /** 成交额 */
  tm: number
  /** 所属行业 */
  ic: string
  /** 昨收价 */
  lcp: number
  /** 总市值 */
  tmv?: number
  /** 交易时间 */
  utc: string
  /** 委差 */
  od: number
  /** 市净率 */
  pb: number
  /** 净值 */
  nav: number
  /** 涨家数 */
  un: number
  /** 平家数 */
  fn: number
  /** 跌家数 */
  dn: number
  /** 昨收 */
  lcp: number
  /** 开盘价 */
  op: number
  /** 最高价 */
  hp: number
  /** 最低价 */
  lp: number
  /** 最小价格变动单位 */
  minTickSize: number
  /**
   * 证券类型
   * 1: 股票
   * 2: 指数
   * 4: 债券
   * 8: 基金
   */
  securityType: number
}

export interface SubscribeMsg {
  QuotationType: string
  token: string
  SearchParamData: { Symbol: string }[]
  tranParam: string
  Limit: number
}
