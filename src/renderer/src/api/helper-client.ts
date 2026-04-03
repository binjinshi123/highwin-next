import { Notice, NoticeResultSchema } from '@renderer/schemas/helper-schema'
import { URLs } from '@shared/config/url-config'
import ky from 'ky'

export const GetNotices = async (token: string): Promise<Notice[]> => {
  try {
    const response = await ky
      .post('api/Message/GetNeedReadMessages', {
        prefixUrl: URLs.helper.apiBase,
        searchParams: {
          token: token
        },
        json: {
          applicationMark: '20',
          showStyle: 2 // 0: 所有显示方式, 1: 弹窗, 2: 跑马灯
        }
      })
      .json()

    const parsed = NoticeResultSchema.safeParse(response)

    if (!parsed.success) {
      console.error('返回数据格式错误: ' + parsed.error.message)
      return []
    }

    return parsed.data
  } catch (error) {
    console.error(error)
    return []
  }
}
