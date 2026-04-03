import { URLs } from '@shared/config/url-config'

export interface MenuItem {
  title: string
  url?: string
  children?: MenuItem[]
}

export interface FlatMenuItem {
  id: number
  title: string
  url?: string
  parentId?: number
}

export const flatMenuData: FlatMenuItem[] = [
  // 行情中心
  { id: 1, title: '行情中心' },
  { id: 2, title: '自选股', url: '/watchlist', parentId: 1 },
  { id: 3, title: '行情报价', url: '/list', parentId: 1 },
  { id: 9, title: '图表分析', url: '/chart', parentId: 1 },
  { id: 10, title: '板块热度', url: `${URLs.highwin.webBase}/webHotChart`, parentId: 1 },

  // 市场资讯
  { id: 11, title: '市场资讯' },
  { id: 12, title: '财经新闻', url: `${URLs.highwin.webBase}/news/finance`, parentId: 11 },
  { id: 13, title: '公告披露', url: `${URLs.highwin.webBase}/news/notice`, parentId: 11 },
  { id: 14, title: '研报中心', url: `${URLs.highwin.webBase}/news/report`, parentId: 11 },
  { id: 15, title: '新股中心', url: `${URLs.highwin.webBase}/news/stock/calendar`, parentId: 11 },
  { id: 16, title: '宏观日历', url: `${URLs.highwin.webBase}/ecoCalendar`, parentId: 11 },
  { id: 17, title: '股市事件', url: `${URLs.highwin.webBase}/stockEvent`, parentId: 11 },
  { id: 18, title: '基金日历', url: `${URLs.highwin.webBase}/fundCalendar`, parentId: 11 },
  {
    id: 19,
    title: '市场情绪',
    url: `${URLs.highwin.webBase}/chance/marketemotion/marketstatistics`,
    parentId: 11
  },

  // 多维数据
  { id: 20, title: '多维数据' },
  {
    id: 21,
    title: '深度资料',
    url: `${URLs.highwin.webBase}/multidata/deepdata/stock`,
    parentId: 20
  },
  {
    id: 22,
    title: '股票专题统计',
    url: `${URLs.highwin.webBase}/stockStatistics/marketOverview`,
    parentId: 20
  },
  {
    id: 23,
    title: '基金专题统计',
    url: `${URLs.highwin.webBase}/fundStatistics/marketProfile`,
    parentId: 20
  },
  { id: 24, title: 'EDB数据浏览器', url: `${URLs.highwin.webBase}/economicDatabase`, parentId: 20 },
  { id: 25, title: '诊股扫雷', url: `${URLs.highwin.webBase}/mineClearance`, parentId: 20 },

  // 投资分析
  { id: 26, title: '投资分析' },
  {
    id: 27,
    title: '智能条件选股',
    url: `${URLs.highwin.webBase}/equityScreener?secretId`,
    parentId: 26
  },
  {
    id: 28,
    title: '组合管理',
    url: `${URLs.highwin.webBase}/portfolio/portfolioReady/regressionAnalysis?productName=HIGHWIN&loginName`,
    parentId: 26
  },
  { id: 29, title: '基金比较', url: `${URLs.highwin.webBase}/analysis/fundAnalysis`, parentId: 26 },
  {
    id: 30,
    title: '基金计算器',
    url: `${URLs.highwin.webBase}/portfolio/portfolioReady/fundCalculator?productName=HIGHWIN&loginName`,
    parentId: 26
  },
  {
    id: 31,
    title: 'WACC计算器',
    url: `${URLs.highwin.webBase}/analysis/waccCalculator`,
    parentId: 26
  },
  {
    id: 32,
    title: 'BETA计算器',
    url: `${URLs.highwin.webBase}/analysis/betaCalculator`,
    parentId: 26
  },
  {
    id: 33,
    title: 'DDM计算器',
    url: `${URLs.highwin.webBase}/analysis/ddmCalculator`,
    parentId: 26
  }
]

// 辅助函数：将扁平结构转换为树形结构
export function buildMenuTree(items: FlatMenuItem[]): MenuItem[] {
  const itemMap = new Map<number, MenuItem>()
  const roots: MenuItem[] = []

  // 首先创建所有节点
  items.forEach((item) => {
    itemMap.set(item.id, { title: item.title, url: item.url, children: [] })
  })

  // 建立父子关系
  items.forEach((item) => {
    const node = itemMap.get(item.id)!
    if (item.parentId) {
      const parent = itemMap.get(item.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

// 导出树形结构的菜单数据
export const menuData: MenuItem[] = buildMenuTree(flatMenuData)

// 辅助函数：根据ID查找菜单项
export function findMenuItemById(id: number): FlatMenuItem | undefined {
  return flatMenuData.find((item) => item.id === id)
}

// 辅助函数：根据标题查找菜单项
export function findMenuItemByTitle(title: string): FlatMenuItem | undefined {
  return flatMenuData.find((item) => item.title === title)
}

// 辅助函数：获取所有子菜单项
export function getChildMenuItems(parentId: number): FlatMenuItem[] {
  return flatMenuData.filter((item) => item.parentId === parentId)
}

// 辅助函数：获取菜单路径（从根节点到目标节点的路径）
export function getMenuPath(targetId: number): FlatMenuItem[] {
  const path: FlatMenuItem[] = []
  let currentId = targetId

  while (currentId) {
    const item = findMenuItemById(currentId)
    if (!item) break
    path.unshift(item)
    currentId = item.parentId || 0
  }

  return path
}
