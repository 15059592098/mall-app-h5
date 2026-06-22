<template>
  <view class="content">
    <view class="admin-notice" v-if="isAdmin">
      <text>管理员 <text class="highlight">15059592098</text> 可添加/移除授权手机号</text>
    </view>

    <view class="add-section" v-if="isAdmin">
      <input class="phone-input" v-model="phoneInput" type="text" maxlength="11" placeholder="输入要授权的手机号" />
      <text class="add-btn" @click="handleAdd">添加</text>
    </view>

    <view class="list-wrap">
      <view v-for="item in permissionList" :key="item.id" class="permission-item">
        <text class="phone">{{ item.phone }}</text>
        <text class="remove-btn" v-if="isAdmin && item.phone !== '15059592098'" @click="handleRemove(item.phone)">移除</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { http } from '@/utils/http'
import { useMemberStore } from '@/stores/member'

const memberStore = useMemberStore()
const isAdmin = ref(memberStore.memberInfo?.phone === '15059592098')
const permissionList = ref<{ id: number; phone: string }[]>([])
const phoneInput = ref('')

const loadList = async () => {
  try {
    const res = await http<{ id: number; phone: string }[]>({ method: 'GET', url: '/managePermission/list' })
    permissionList.value = res.data || []
  } catch (e) {
    console.error('加载授权列表失败', e)
  }
}

onShow(() => {
  if (isAdmin.value) loadList()
})

const handleAdd = async () => {
  const phone = phoneInput.value.trim()
  if (!phone || phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  try {
    await http({ method: 'POST', url: '/managePermission/add', params: { phone } })
    uni.showToast({ title: '授权成功', icon: 'none' })
    phoneInput.value = ''
    loadList()
  } catch (e) {
    console.error('授权失败', e)
  }
}

const handleRemove = (phone: string) => {
  uni.showModal({
    title: '提示',
    content: `确定要移除 ${phone} 的权限吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await http({ method: 'POST', url: '/managePermission/remove', params: { phone } })
          uni.showToast({ title: '移除成功', icon: 'none' })
          loadList()
        } catch (e) {
          console.error('移除失败', e)
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
}

.admin-notice {
  background: #fff3e0;
  padding: 20rpx 30rpx;
  font-size: 26rpx;
  color: #e65100;
  .highlight {
    font-weight: bold;
  }
}

.add-section {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;

  .phone-input {
    flex: 1;
    height: 72rpx;
    background: #fff;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }

  .add-btn {
    height: 72rpx;
    line-height: 72rpx;
    padding: 0 40rpx;
    background: #fa436a;
    color: #fff;
    border-radius: 8rpx;
    font-size: 28rpx;
  }
}

.list-wrap {
  padding: 0 30rpx;

  .permission-item {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 24rpx 30rpx;
    border-radius: 10rpx;
    margin-bottom: 16rpx;

    .phone {
      flex: 1;
      font-size: 30rpx;
      color: #333;
    }

    .remove-btn {
      font-size: 26rpx;
      color: #fa436a;
      padding: 8rpx 20rpx;
      border: 1rpx solid #fa436a;
      border-radius: 6rpx;
    }
  }
}
</style>
