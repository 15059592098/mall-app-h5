import { http } from '@/utils/http'
import type { PmsComment } from '@/types/memberComment'
import type { CommonPage, PageParam } from '@/types/common'

/** 获取评价列表 */
export const fetchCommentListAPI = (params: PageParam) => {
  return http<CommonPage<PmsComment>>({
    method: 'GET',
    url: '/member/comment/list',
    params,
  })
}
