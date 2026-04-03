export const toTypeId = (securityType: number): string => {
  switch (securityType) {
    case 1:
    case 19:
    case 21:
      return 'S0101'
    case 2: // 基金
      return 'S0103'
    case 3: // 债券
      return 'S0102'
    case 4: // 指数
      return 'S0104'
    default:
      return 'S0101'
  }
}
