import {
  Activity,
  Newspaper,
  LucideIcon,
  LineChart,
  Logs,
  CandlestickChart,
  Layers,
  Microscope,
  ScanSearch,
  Smile,
  Drum,
  Radar,
  Heart
} from 'lucide-react'

import { URLs } from '@shared/config/url-config'

export type ModuleKey =
  | 'list'
  | 'watchlist'
  | 'screener'
  | 'notice'
  | 'report'
  | 'news'
  | 'heatmap'
  | 'chart'
  | 'radar'
  | 'F9'
  | 'emotion'
  | 'ipo'
  | 'statistics'

export interface ModuleLink {
  title: string
  description?: string
  icon: LucideIcon
  url: string
}

export const moduleLinks: Record<ModuleKey, ModuleLink> = {
  list: {
    title: '行情列表',
    url: `/list`,
    icon: Logs,
    description: '展示中国内地市场股票的行情列表，实时刷新数据'
  },
  watchlist: {
    title: '自选股',
    url: `/watchlist`,
    icon: Heart,
    description: '展示用户自选的股票列表'
  },
  screener: {
    title: '智能选股',
    url: `${URLs.highwin.webBase}/equityScreener?secretId`,
    icon: ScanSearch,
    description: '根据用户自然语言输入的选股要求进行个股筛选'
  },
  notice: {
    title: '公告披露',
    url: `${URLs.highwin.webBase}/news/notice`,
    icon: Newspaper,
    description: '覆盖中国内地证券市场中股票、债券、基金的公开信息'
  },
  report: {
    title: '研报中心',
    url: `${URLs.highwin.webBase}/news/report`,
    icon: Activity,
    description: '提供各类证券或行业研究机构发布的研究报告'
  },
  news: {
    title: '财经新闻',
    url: `${URLs.highwin.webBase}/news/finance`,
    icon: Newspaper,
    description: '实时推送上市公司新闻，保证新闻时效性'
  },
  heatmap: {
    title: '板块热度',
    url: `${URLs.highwin.webBase}/webHotChart`,
    icon: Layers,
    description: '不同行业分类或概念板块，板块成交热度及涨跌幅的实时变化'
  },
  chart: {
    title: '图表分析',
    url: `/chart`,
    icon: CandlestickChart,
    description: '专注个股行情变化'
  },
  radar: {
    title: '诊股扫雷',
    url: `${URLs.highwin.webBase}/mineClearance`,
    icon: Radar,
    description: '按基本面、消息面、技术面及资金面对股票风险进行检测'
  },
  F9: {
    title: '深度资料',
    url: `${URLs.highwin.webBase}/multidata/deepdata/stock`,
    icon: Microscope,
    description: '展示标的信息 、行情、财务等全方面的资料'
  },
  emotion: {
    title: '市场情绪',
    url: `${URLs.highwin.webBase}/chance/marketemotion/marketstatistics`,
    icon: Smile,
    description: '捕捉市场投资情绪，从情绪、涨跌数和龙虎榜，把控市场变化…'
  },
  ipo: {
    title: '新股中心',
    url: `${URLs.highwin.webBase}/news/stock/calendar`,
    icon: Drum,
    description: '展示新股上市动态'
  },
  statistics: {
    title: '股票专题统计',
    url: `${URLs.highwin.webBase}/stockStatistics/marketOverview`,
    icon: LineChart,
    description: '股票市场各类专题数据展示'
  }
}
