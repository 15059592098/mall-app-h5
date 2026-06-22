<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="right-top-sign"></view>
    <view class="wrapper">
      <view class="left-top-sign">LOGIN</view>
      <view class="welcome">手机号登录</view>
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号</text>
          <input
            type="number"
            v-model="telephone"
            placeholder="请输入手机号"
            :maxlength="11"
          />
        </view>
        <view class="input-item">
          <text class="tit">验证码</text>
          <view class="auth-code-row">
            <input
              type="text"
              v-model="authCode"
              placeholder="请输入验证码"
              :maxlength="6"
            />
            <button
              class="get-code-btn"
              :class="{ disabled: countdown > 0 }"
              :disabled="countdown > 0"
              @click="handleGetAuthCode"
            >
              {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
            </button>
          </view>
        </view>
      </view>
      <button class="confirm-btn" @click="toLogin" :disabled="logining">
        {{ logining ? '登录中...' : '登录 / 注册' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemberStore } from '@/stores/member'
import { getAuthCodeAPI } from '@/apis/member'

const memberStore = useMemberStore()

const telephone = ref('')
const authCode = ref('')
const logining = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 获取验证码
const handleGetAuthCode = async () => {
  if (!telephone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(telephone.value)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return
  }

  try {
    const res = await getAuthCodeAPI(telephone.value)
    const code = res.data || '验证码已发送'
    uni.showToast({ title: `验证码：${code}`, icon: 'none', duration: 5000 })
    startCountdown()
  } catch {
    uni.showToast({ title: '获取验证码失败', icon: 'none' })
  }
}

// 登录/注册
const toLogin = async () => {
  if (!telephone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!authCode.value) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  logining.value = true
  try {
    await memberStore.memberLoginByPhone(telephone.value, authCode.value)
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.switchTab({ url: '/pages/index/index' })
      }
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error?.message || '登录失败', icon: 'none' })
  } finally {
    logining.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = 0
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

const navBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss">
page {
  background: #fff;
}
</style>

<style lang="scss" scoped>
.container {
  padding-top: 115px;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

.wrapper {
  position: relative;
  z-index: 90;
  background: #fff;
  padding-bottom: 40rpx;
}

.back-btn {
  position: absolute;
  left: 40rpx;
  z-index: 9999;
  top: calc(var(--status-bar-height) + 40rpx);
  font-size: 40rpx;
  color: $font-color-dark;
}

.left-top-sign {
  font-size: 120rpx;
  color: $page-color-base;
  position: relative;
  left: -16rpx;
}

.right-top-sign {
  position: absolute;
  top: calc(var(--status-bar-height) + 80rpx);
  right: -30rpx;
  z-index: 95;

  &:before,
  &:after {
    display: block;
    content: '';
    width: 400rpx;
    height: 80rpx;
    background: #b4f3e2;
  }

  &:before {
    transform: rotate(50deg);
    border-radius: 0 50px 0 0;
  }

  &:after {
    position: absolute;
    right: -198rpx;
    top: 0;
    transform: rotate(-50deg);
    border-radius: 50px 0 0 0;
  }
}

.left-bottom-sign {
  position: absolute;
  left: -270rpx;
  bottom: -320rpx;
  border: 100rpx solid #d0d1fd;
  border-radius: 50%;
  padding: 180rpx;
}

.welcome {
  position: relative;
  left: 50rpx;
  top: -90rpx;
  font-size: 46rpx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}

.input-content {
  padding: 0 60rpx;
}

.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background: $page-color-light;
  height: 120rpx;
  border-radius: 4px;
  margin-bottom: 50rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .tit {
    height: 50rpx;
    line-height: 56rpx;
    font-size: $font-sm + 2rpx;
    color: $font-color-base;
  }

  input {
    height: 60rpx;
    font-size: $font-base + 2rpx;
    color: $font-color-dark;
    width: 100%;
  }
}

.auth-code-row {
  display: flex;
  align-items: center;
  width: 100%;

  input {
    flex: 1;
  }

  .get-code-btn {
    flex-shrink: 0;
    width: 200rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 24rpx;
    color: $uni-color-primary;
    background: #fff;
    border: 1rpx solid $uni-color-primary;
    border-radius: 8rpx;
    padding: 0;
    margin: 0;
    margin-left: 20rpx;

    &::after {
      border: none;
    }

    &.disabled {
      color: $font-color-disabled;
      border-color: $font-color-disabled;
    }
  }
}

.confirm-btn {
  width: 630rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 50px;
  margin-top: 70rpx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;

  &:after {
    border-radius: 100px;
  }
}
</style>
