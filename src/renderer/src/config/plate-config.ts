import { Plate, PlateType } from '@shared/types'

interface plateMenu {
  type: PlateType
  label: string
  plates: Plate[]
}
export const plateList: plateMenu[] = [
  {
    type: 'stock',
    label: '股票',
    plates: [
      {
        id: 1001001,
        name: '沪深A股',
        type: 'stock'
      },
      {
        id: 1001001001001,
        name: '上证主板',
        type: 'stock'
      },
      {
        id: 1001001002001,
        name: '深证主板',
        type: 'stock'
      },
      {
        id: 1001001004,
        name: '北证A股',
        type: 'stock'
      },
      {
        id: 1001001001002,
        name: '科创板',
        type: 'stock'
      },
      {
        id: 1001001002003,
        name: '创业板',
        type: 'stock'
      }
    ]
  },
  {
    type: 'fund',
    label: '基金',
    plates: [
      {
        id: 1301021001,
        name: '上证基金',
        type: 'fund'
      },
      {
        id: 1301021002,
        name: '深证基金',
        type: 'fund'
      },
      {
        id: 1301023001,
        name: '封闭式基金',
        type: 'fund'
      },
      {
        id: 1301023003,
        name: 'ETF基金',
        type: 'fund'
      },
      {
        id: 1301023002,
        name: 'LOF基金',
        type: 'fund'
      },
      {
        id: 1303001,
        name: '股票基金',
        type: 'fund'
      },
      {
        id: 1303002,
        name: '混合基金',
        type: 'fund'
      },
      {
        id: 1303003,
        name: '债券基金',
        type: 'fund'
      },
      {
        id: 1301006,
        name: '货币基金',
        type: 'fund'
      },
      {
        id: 1301012,
        name: 'QDII基金',
        type: 'fund'
      },
      {
        id: 1301025,
        name: 'T+0基金',
        type: 'fund'
      },
      {
        id: 1301024,
        name: 'REITs',
        type: 'fund'
      }
    ]
  },
  {
    type: 'bond',
    label: '债券',
    plates: [
      {
        id: 2001001,
        name: '上证债券',
        type: 'bond'
      },
      {
        id: 2001002,
        name: '深证债券',
        type: 'bond'
      },
      {
        id: 2001011,
        name: '北证债券',
        type: 'bond'
      },
      {
        id: 2002005,
        name: '债券回购',
        type: 'bond'
      },
      {
        id: 2002002,
        name: '可转债',
        type: 'bond'
      },
      {
        id: 2002001,
        name: '国债',
        type: 'bond'
      },
      {
        id: 2002006,
        name: '地方政府债',
        type: 'bond'
      },
      {
        id: 2002004,
        name: '公司债',
        type: 'bond'
      },
      {
        id: 2002003,
        name: '企业债',
        type: 'bond'
      }
    ]
  },
  {
    type: 'index',
    label: '指数',
    plates: [
      {
        id: 1401001,
        name: '上证指数',
        type: 'index'
      },
      {
        id: 1401002,
        name: '深证指数',
        type: 'index'
      },
      {
        id: 1401007,
        name: '上证指数通',
        type: 'index'
      },
      {
        id: 1404004,
        name: '巨潮指数',
        type: 'index'
      },
      {
        id: 1404003,
        name: '中证指数',
        type: 'index'
      },
      {
        id: 1402001,
        name: '股票指数',
        type: 'index'
      },
      {
        id: 1402002,
        name: '基金指数',
        type: 'index'
      },
      {
        id: 1402003,
        name: '债券指数',
        type: 'index'
      }
    ]
  }
]

export const defaultPlate: Plate = { id: 1001001, name: '沪深A股', type: 'stock' }
