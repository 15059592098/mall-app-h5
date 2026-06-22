import { http } from '@/utils/http'
import type { PmsProduct } from '@/types/product'

export interface ManageProductForm {
  name: string
  price: number
  note?: string
  pic?: string
  albumPics?: string[]
  sizes: string[]
  colors: string[]
  productCategoryId?: number
}

/** 获取商品管理列表 */
export const getManageProductListAPI = (pageNum = 1, pageSize = 50) => {
  return http<PmsProduct[]>({
    method: 'GET',
    url: '/manageProduct/list',
    params: { pageNum, pageSize },
  })
}

/** 获取商品编辑信息 */
export const getManageProductAPI = (id: number) => {
  return http<{ product: PmsProduct; sizes: string[]; colors: string[] }>({
    method: 'GET',
    url: `/manageProduct/${id}`,
  })
}

/** 创建商品 */
export const createManageProductAPI = (data: ManageProductForm) => {
  return http({
    method: 'POST',
    url: '/manageProduct/create',
    data,
  })
}

/** 修改商品 */
export const updateManageProductAPI = (id: number, data: ManageProductForm) => {
  return http({
    method: 'POST',
    url: `/manageProduct/update/${id}`,
    data,
  })
}

/** 更新商品状态（支持 publishStatus/newStatus/recommandStatus） */
export const updateProductStatusAPI = (id: number, fields: Record<string, number>) => {
  return http({
    method: 'POST',
    url: '/manageProduct/updateStatus',
    data: { id, ...fields },
  })
}

/** 获取新鲜好物和人气推荐状态 */
export const getHomeStatusAPI = () => {
  return http<{ newProductIds: number[]; hotProductIds: number[] }>({
    method: 'GET',
    url: '/manageProduct/homeStatus',
  })
}

/** 设置新鲜好物 */
export const setNewProductAPI = (productId: number, productName: string, enable: number) => {
  return http({
    method: 'POST',
    url: '/manageProduct/setNewProduct',
    params: { productId, productName, enable },
  })
}

/** 设置人气推荐 */
export const setHotProductAPI = (productId: number, productName: string, enable: number) => {
  return http({
    method: 'POST',
    url: '/manageProduct/setHotProduct',
    params: { productId, productName, enable },
  })
}

/** 删除商品 */
export const deleteManageProductAPI = (id: number) => {
  return http({
    method: 'POST',
    url: '/manageProduct/delete',
    params: { id },
  })
}
