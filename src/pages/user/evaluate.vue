<template>
  <view class="content">
    <empty v-if="commentList.length === 0"></empty>
    <view class="comment-section">
      <view v-for="(item, index) in commentList" :key="index" class="comment-item">
        <view class="comment-header">
          <image class="avatar" :src="item.memberIcon || '/static/missing-face.png'" mode="aspectFill"></image>
          <text class="nickname">{{ item.memberNickName }}</text>
          <text class="star">{{ '★'.repeat(item.star || 0) }}{{ '☆'.repeat(5 - (item.star || 0)) }}</text>
        </view>
        <view class="comment-body">
          <text class="product-name">商品：{{ item.productName }}</text>
          <text class="content">{{ item.content }}</text>
          <view v-if="item.pics" class="pics">
            <image v-for="(pic, pIdx) in item.pics.split(',')" :key="pIdx" :src="pic" mode="aspectFill" class="pic"></image>
          </view>
        </view>
        <view class="comment-footer">
          <text class="time">{{ formatDateTime(item.createTime) }}</text>
        </view>
      </view>
    </view>
    <view v-if="loadingType === 'more'" class="load-more">上拉加载更多</view>
    <view v-else-if="loadingType === 'loading'" class="load-more">加载中...</view>
    <view v-else class="load-more">没有更多了</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onReachBottom, onNavigationBarButtonTap } from '@dcloudio/uni-app'
import { fetchCommentListAPI } from '@/apis/memberComment'
import type { PmsComment } from '@/types/memberComment'
import type { PageParam } from '@/types/common'
import empty from '@/components/empty.vue'

const loadingType = ref<'more' | 'loading' | 'nomore'>('more')
const commentList = ref<PmsComment[]>([])
const pageParam: PageParam = { pageNum: 1, pageSize: 5 }

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const getCommentList = async () => {
  loadingType.value = 'loading'
  try {
    const res = await fetchCommentListAPI(pageParam)
    const newList = res.data.list || []
    commentList.value = pageParam.pageNum === 1 ? newList : [...commentList.value, ...newList]
    loadingType.value = newList.length < pageParam.pageSize ? 'nomore' : 'more'
    pageParam.pageNum!++
  } catch {
    loadingType.value = 'nomore'
  }
}

onLoad(() => getCommentList())
onReachBottom(() => { if (loadingType.value === 'more') getCommentList() })

onNavigationBarButtonTap(() => {
  uni.showModal({
    title: '提示',
    content: '确认清空评价列表？',
    success: (res) => { if (res.confirm) { commentList.value = []; loadingType.value = 'nomore' } },
  })
})
</script>

<style lang="scss" scoped>
.content { padding: 20rpx; }
.comment-item {
  background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 20rpx;
  .comment-header {
    display: flex; align-items: center; margin-bottom: 16rpx;
    .avatar { width: 50rpx; height: 50rpx; border-radius: 50%; margin-right: 16rpx; }
    .nickname { font-size: 26rpx; color: #333; flex: 1; }
    .star { font-size: 24rpx; color: #fa436a; }
  }
  .comment-body {
    .product-name { font-size: 22rpx; color: #999; display: block; margin-bottom: 8rpx; }
    .content { font-size: 28rpx; color: #333; line-height: 1.6; }
    .pics { display: flex; flex-wrap: wrap; gap: 10rpx; margin-top: 12rpx;
      .pic { width: 180rpx; height: 180rpx; border-radius: 8rpx; }
    }
  }
  .comment-footer { margin-top: 12rpx;
    .time { font-size: 22rpx; color: #999; }
  }
}
.load-more { text-align: center; padding: 20rpx; font-size: 24rpx; color: #999; }
</style>
