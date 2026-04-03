import { PlateType } from '@shared/types'

export const plateIdMap: Record<PlateType, number[]> = {
  stock: [
    1001001, // 沪深A股
    1001001004 // 北证A股
  ],
  fund: [
    1301021 // 上市基金
  ],
  bond: [
    2001001, // 上交所债券
    2001002, // 深交所债券
    2002005 // 逆回购
  ],
  index: [
    1401001, // 上证指数
    1401002, // 深证指数
    1404003 // 中证指数
  ]
}
