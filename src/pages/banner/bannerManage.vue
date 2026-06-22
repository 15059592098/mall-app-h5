<template>
  <view class="content">
    <view v-if="list.length === 0" class="empty-tip">
      <text>暂无轮播图，点击下方按钮添加</text>
    </view>
    <view v-for="item in list" :key="item.id" class="banner-item">
      <image class="banner-pic" :src="item.pic || '/static/missing-face.png'" mode="aspectFill"></image>
      <view class="banner-info">
        <text class="banner-name clamp">{{ item.name }}</text>
        <text class="banner-sort">排序: {{ item.sort }}</text>
        <text :class="['status-tag', item.status === 1 ? 'online' : 'offline']">
          {{ item.status === 1 ? '已上线' : '已下线' }}
        </text>
      </view>
      <view class="right-actions">
        <switch :checked="item.status === 1" @change="handleToggle(item)" color="#fa436a" style="transform: scale(0.7)" />
        <view class="action-row">
          <text class="yticon icon-bianji edit-btn" @click.stop="handleEdit(item.id!)"></text>
          <text class="yticon icon-iconfontshanchu1 del-btn" @click.stop="handleDelete(item.id!)"></text>
        </view>
      </view>
    </view>

    <view class="add-btn" @click="handleAdd">
      <text class="yticon icon--add"></text>
      <text>添加轮播图</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAdvertiseListAPI, deleteAdvertiseAPI, toggleAdvertiseStatusAPI } from '@/apis/banner'
import type { SmsHomeAdvertise } from '@/types/home'

const list = ref<SmsHomeAdvertise[]>([])

const loadList = async () => {
  try {
    const res = await getAdvertiseListAPI()
    list.value = res.data || []
  } catch (e) {
    console.error('加载轮播图失败', e)
  }
}

onShow(() => {
  loadList()
})

const handleAdd = () => {
  uni.navigateTo({ url: '/pages/banner/bannerForm' })
}

const handleEdit = (id: number) => {
  uni.navigateTo({ url: `/pages/banner/bannerForm?id=${id}` })
}

const handleToggle = async (item: SmsHomeAdvertise) => {
  try {
    const newStatus = item.status === 1 ? 0 : 1
    await toggleAdvertiseStatusAPI(item.id!, newStatus)
    item.status = newStatus
    uni.showToast({ title: newStatus === 1 ? '已上线' : '已下线', icon: 'none' })
  } catch (e) {
    console.error('切换状态失败', e)
  }
}

const handleDelete = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该轮播图吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteAdvertiseAPI(id)
          uni.showToast({ title: '删除成功', icon: 'none' })
          loadList()
        } catch (e) {
          console.error('删除失败', e)
        }
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  background: $page-color-base;
  padding-bottom: 120rpx;
}

.empty-tip {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 28rpx;
}

.banner-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin: 20rpx 30rpx;

  .banner-pic {
    width: 200rpx;
    height: 100rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
  }

  .banner-info {
    flex: 1;
    margin-left: 20rpx;

    .banner-name {
      font-size: 28rpx;
      color: #303133;
    }

    .banner-sort {
      font-size: 22rpx;
      color: #999;
      display: block;
      margin-top: 6rpx;
    }

    .status-tag {
      font-size: 20rpx;
      padding: 2rpx 10rpx;
      border-radius: 4rpx;
      margin-top: 6rpx;
      display: inline-block;

      &.online {
        background: #e8f8f0;
        color: #5fcda2;
      }

      &.offline {
        background: #fef0f0;
        color: #fa436a;
      }
    }
  }

  .right-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6rpx;
    flex-shrink: 0;

    .action-row {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .edit-btn {
        font-size: 32rpx;
        color: #5fcda2;
      }

      .del-btn {
        font-size: 32rpx;
        color: #ccc;
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
