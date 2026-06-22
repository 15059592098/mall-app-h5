<template>
  <view class="content">
    <view class="product-list">
      <view v-for="item in productList" :key="item.id" class="product-item">
        <image class="product-img" :src="item.pic || '/static/missing-face.png'" mode="aspectFill" @click="handleEdit(item.id!)"></image>
        <view class="product-info" @click="handleEdit(item.id!)">
          <text class="product-name clamp">{{ item.name }}</text>
          <text class="product-price">¥{{ item.price }}</text>
          <view class="category-tag">{{ getCategoryName(item.productCategoryId) }}</view>
        </view>
        <view class="right-actions">
          <view class="switch-row">
            <text class="switch-label">上架</text>
            <switch :checked="!!item.publishStatus" @change="handleToggleStatus(item, 'publishStatus', $event)" color="#fa436a" style="transform: scale(0.7); transform-origin: right center;" />
          </view>
          <view class="switch-row">
            <text class="switch-label">新品</text>
            <switch :checked="!!item.newStatus" @change="handleToggleStatus(item, 'newStatus', $event)" color="#fa436a" style="transform: scale(0.7); transform-origin: right center;" />
          </view>
          <view class="switch-row">
            <text class="switch-label">推荐</text>
            <switch :checked="!!item.recommandStatus" @change="handleToggleStatus(item, 'recommandStatus', $event)" color="#fa436a" style="transform: scale(0.7); transform-origin: right center;" />
          </view>
          <view class="switch-row">
            <text class="switch-label">新鲜好物</text>
            <switch :checked="newProductIds.has(item.id!)" @change="handleToggleHome(item, 'new')" color="#fa436a" style="transform: scale(0.7); transform-origin: right center;" />
          </view>
          <view class="switch-row">
            <text class="switch-label">人气推荐</text>
            <switch :checked="hotProductIds.has(item.id!)" @change="handleToggleHome(item, 'hot')" color="#fa436a" style="transform: scale(0.7); transform-origin: right center;" />
          </view>
          <view class="action-row">
            <text class="yticon icon-bianji edit-btn" @click.stop="handleEdit(item.id!)"></text>
            <text class="yticon icon-iconfontshanchu1 del-btn" @click.stop="handleDelete(item.id!)"></text>
          </view>
        </view>
      </view>
    </view>

    <view class="add-btn" @click="handleAdd">
      <text class="yticon icon--add"></text>
      <text>添加商品</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getCategoryTreeAPI } from '@/apis/product'
import { getManageProductListAPI, deleteManageProductAPI, updateProductStatusAPI, getHomeStatusAPI, setNewProductAPI, setHotProductAPI } from '@/apis/manageProduct'
import type { PmsProduct } from '@/types/product'

const productList = ref<PmsProduct[]>([])
const categoryOptions = ref<{ id: number; name: string }[]>([])
const newProductIds = ref(new Set<number>())
const hotProductIds = ref(new Set<number>())

const getCategoryName = (id?: number) => {
  if (!id) return ''
  return categoryOptions.value.find(c => c.id === id)?.name || ''
}

const loadList = async () => {
  try {
    const [listRes, catRes, homeRes] = await Promise.all([
      getManageProductListAPI(),
      getCategoryTreeAPI(),
      getHomeStatusAPI(),
    ])
    productList.value = listRes.data || []
    newProductIds.value = new Set(homeRes.data?.newProductIds || [])
    hotProductIds.value = new Set(homeRes.data?.hotProductIds || [])
    // 扁平化分类树
    const flatten = (list: any[]): { id: number; name: string }[] => {
      const result: { id: number; name: string }[] = []
      for (const item of list) {
        result.push({ id: item.id, name: item.name })
        if (item.children) result.push(...flatten(item.children))
      }
      return result
    }
    categoryOptions.value = flatten(catRes.data || [])
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

onShow(() => {
  loadList()
})

const handleAdd = () => {
  uni.navigateTo({ url: '/pages/productManage/productForm' })
}

const handleEdit = (id: number) => {
  uni.navigateTo({ url: `/pages/productManage/productForm?id=${id}` })
}

const handleDelete = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteManageProductAPI(id)
          uni.showToast({ title: '删除成功', icon: 'none' })
          loadList()
        } catch (e) {
          console.error('删除失败', e)
        }
      }
    },
  })
}

const handleToggleHome = async (item: any, type: string) => {
  const isNew = type === 'new'
  const currentSet = isNew ? newProductIds : hotProductIds
  const enabled = !currentSet.value.has(item.id!)
  try {
    if (isNew) {
      await setNewProductAPI(item.id!, item.name, enabled ? 1 : 0)
    } else {
      await setHotProductAPI(item.id!, item.name, enabled ? 1 : 0)
    }
    if (enabled) currentSet.value.add(item.id!)
    else currentSet.value.delete(item.id!)
  } catch (e) {
    console.error('操作失败', e)
  }
}

const handleToggleStatus = async (item: any, field: string, e: any) => {
  const newVal = e.detail.value ? 1 : 0
  try {
    await updateProductStatusAPI(item.id!, { [field]: newVal })
    item[field] = newVal
  } catch (e) {
    console.error('更新状态失败', e)
  }
}
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  background: $page-color-base;
  padding-bottom: 120rpx;
}

.product-list {
  padding: 20rpx 30rpx;
}

.product-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  position: relative;

  .product-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
  }

  .product-info {
    flex: 1;
    margin-left: 20rpx;
    .product-name {
      font-size: 28rpx;
      color: #303133;
      line-height: 1.4;
    }
    .product-price {
      font-size: 30rpx;
      color: #fa436a;
      margin-top: 10rpx;
      display: block;
    }
    .category-tag {
      font-size: 22rpx;
      color: #999;
      margin-top: 6rpx;
    }
  }

  .right-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2rpx;
    margin-left: 10rpx;
    flex-shrink: 0;

    .switch-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 40rpx;
    }

    .switch-label {
      font-size: 22rpx;
      color: #999;
      margin-right: 4rpx;
    }

    .del-btn {
      font-size: 32rpx;
      color: #ccc;
      margin-top: 6rpx;
    }

    .action-row {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-top: 6rpx;

      .edit-btn {
        font-size: 32rpx;
        color: #5fcda2;
      }
    }
  }
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  margin: 20rpx 30rpx;
  background: #fff;
  border-radius: 10rpx;
  border: 2rpx dashed #ddd;
  color: #999;
  font-size: 28rpx;
  .yticon {
    font-size: 36rpx;
    margin-right: 10rpx;
  }
}
</style>
