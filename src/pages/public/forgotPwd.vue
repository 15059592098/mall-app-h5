<template>
  <view class="container">
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="wrapper">
      <view class="title">找回密码</view>

      <!-- 步骤1：输入手机号 -->
      <view v-if="step === 1" class="input-content">
        <view class="input-item">
          <text class="tit">手机号</text>
          <input type="number" v-model="telephone" placeholder="请输入手机号" :maxlength="11" />
        </view>
        <button class="confirm-btn" @click="handleStep1">下一步</button>
      </view>

      <!-- 步骤2：回答密保问题 -->
      <view v-if="step === 2" class="input-content">
        <view class="input-item" style="height:auto;padding:20rpx 30rpx;">
          <text class="tit">密保问题</text>
          <text style="font-size:30rpx;color:#333;margin-top:8rpx;">{{ questionText }}</text>
        </view>
        <view class="input-item">
          <text class="tit">密保答案</text>
          <input type="text" v-model="answer" placeholder="请输入你的密保答案" :maxlength="30" />
        </view>
        <button class="confirm-btn" @click="handleStep2">验证密保</button>
      </view>

      <!-- 步骤3：设置新密码 -->
      <view v-if="step === 3" class="input-content">
        <view class="input-item">
          <text class="tit">新密码</text>
          <input type="text" v-model="newPassword" :password="!showPwd" placeholder="请输入新密码（6位以上）" :maxlength="20" />
        </view>
        <button class="confirm-btn" @click="handleStep3">重置密码</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getQuestionAPI, resetPasswordByQuestionAPI } from '@/apis/member'

const step = ref(1)
const telephone = ref('')
const questionText = ref('')
const answer = ref('')
const newPassword = ref('')
const showPwd = ref(false)

const handleStep1 = async () => {
  if (!telephone.value || !/^1[3-9]\d{9}$/.test(telephone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  try {
    const res = await getQuestionAPI(telephone.value)
    questionText.value = res.data || ''
    step.value = 2
  } catch {
    uni.showToast({ title: '该账号不存在或未设置密保', icon: 'none' })
  }
}

const handleStep2 = async () => {
  if (!answer.value) {
    uni.showToast({ title: '请输入密保答案', icon: 'none' })
    return
  }
  step.value = 3
}

const handleStep3 = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return
  }
  uni.showLoading({ title: '重置中...' })
  try {
    await resetPasswordByQuestionAPI(telephone.value, answer.value, newPassword.value)
    uni.hideLoading()
    uni.showToast({ title: '密码重置成功，请重新登录', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e: any) {
    uni.hideLoading()
    uni.showToast({ title: e?.message || '重置失败', icon: 'none' })
  }
}

const navBack = () => uni.navigateBack()
</script>

<style lang="scss">
page { background: #fff; }
</style>
<style lang="scss" scoped>
.container {
  padding-top: 115px;
  width: 100vw;
  min-height: 100vh;
  background: #fff;
}
.back-btn {
  position: absolute;
  left: 40rpx;
  z-index: 9999;
  top: calc(var(--status-bar-height) + 40rpx);
  font-size: 40rpx;
  color: $font-color-dark;
}
.wrapper { padding: 0 40rpx; }
.title {
  font-size: 46rpx;
  color: #555;
  margin-bottom: 40rpx;
  text-align: center;
}
.input-content { padding: 0 20rpx; }
.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background: $page-color-light;
  height: 120rpx;
  border-radius: 4px;
  margin-bottom: 30rpx;
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
.confirm-btn {
  width: 100%;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 50px;
  margin-top: 30rpx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;
  &:after { border-radius: 100px; }
}
</style>
