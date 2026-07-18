/**
 * 会员商品评价相关类型
 */

/** 商品评价 - 对应后端 PmsComment */
export type PmsComment = {
  id?: number
  productId?: number
  memberId?: number
  memberNickName?: string
  productName?: string
  star?: number
  memberIp?: string
  createTime?: string
  showStatus?: number
  productAttribute?: string
  content?: string
  pics?: string
  memberIcon?: string
  replayCount?: number
}
