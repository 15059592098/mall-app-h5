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
          <input type="number" v-model="telephone" placeholder="请输入手机号" :maxlength="11" />
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <input type="text" v-model="password" :password="!showPwd" placeholder="请输入密码" :maxlength="20" />
        </view>

        <!-- 注册模式才显示的密保字段 -->
        <template v-if="isRegister">
          <view class="input-item">
            <text class="tit">密保问题</text>
            <picker @change="onQuestionChange" :range="questionOptions" range-key="label">
              <view class="picker-input">{{ questionLabel }}</view>
            </picker>
          </view>
          <view class="input-item">
            <text class="tit">密保答案</text>
            <input type="text" v-model="answer" placeholder="用于找回密码" :maxlength="30" />
          </view>
        </template>
      </view>

      <button v-if="!isRegister" class="confirm-btn" @click="toLogin" :disabled="logining">
        {{ logining ? '登录中...' : '登录' }}
      </button>
      <button v-else class="confirm-btn" @click="toRegister" :disabled="logining">
        {{ logining ? '注册中...' : '注册' }}
      </button>

      <view class="bottom-links">
        <view class="forgot-pwd" @click="goForgotPwd">忘记密码</view>
        <view class="register-link" @click="toggleRegister">
          {{ isRegister ? '已有账号？去登录' : '还没有账号？去注册' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemberStore } from '@/stores/member'
import { registerWithQuestionAPI } from '@/apis/member'

const memberStore = useMemberStore()

const isRegister = ref(false)
const telephone = ref('')
const password = ref('')
const answer = ref('')
const logining = ref(false)
const showPwd = ref(false)

const questionOptions = [
  { label: '请选择密保问题', value: '' },
  { label: '你的生日是？', value: '你的生日是？' },
  { label: '你最喜欢的歌曲？', value: '你最喜欢的歌曲？' },
  { label: '你的宠物名字？', value: '你的宠物名字？' },
  { label: '你的小学名称？', value: '你的小学名称？' },
  { label: '你的家乡是？', value: '你的家乡是？' },
]
const selectedQuestion = ref('')
const questionLabel = ref('请选择密保问题')

const onQuestionChange = (e: any) => {
  const idx = e.detail.value
  selectedQuestion.value = questionOptions[idx]?.value || ''
  questionLabel.value = questionOptions[idx]?.label || '请选择密保问题'
}

const toggleRegister = () => {
  isRegister.value = !isRegister.value
  password.value = ''
  answer.value = ''
}

const toLogin = async () => {
  if (!telephone.value || !/^1[3-9]\d{9}$/.test(telephone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!password.value) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  logining.value = true
  try {
    await memberStore.memberLogin(telephone.value, password.value)
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) { uni.navigateBack() }
      else { uni.switchTab({ url: '/pages/index/index' }) }
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error?.message || '登录失败', icon: 'none' })
  } finally {
    logining.value = false
  }
}

const toRegister = async () => {
  if (!telephone.value || !/^1[3-9]\d{9}$/.test(telephone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!password.value || password.value.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return
  }
  if (!selectedQuestion.value) {
    uni.showToast({ title: '请选择密保问题', icon: 'none' })
    return
  }
  if (!answer.value) {
    uni.showToast({ title: '请输入密保答案', icon: 'none' })
    return
  }
  logining.value = true
  try {
    await registerWithQuestionAPI({
      username: telephone.value,
      password: password.value,
      telephone: telephone.value,
      question: selectedQuestion.value,
      answer: answer.value,
    })
    await memberStore.memberLogin(telephone.value, password.value)
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) { uni.navigateBack() }
      else { uni.switchTab({ url: '/pages/index/index' }) }
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error?.data?.message || '注册失败', icon: 'none' })
  } finally {
    logining.value = false
  }
}

const goForgotPwd = () => uni.navigateTo({ url: '/pages/public/forgotPwd' })
const navBack = () => uni.navigateBack()
</script>

<style lang="scss">
page { background: #fff; }
</style>
<style lang="scss" scoped>
.container {
  padding-top: 115px; position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #fff;
}
.wrapper { position: relative; z-index: 90; background: #fff; padding-bottom: 40rpx; }
.back-btn {
  position: absolute; left: 40rpx; z-index: 9999;
  top: calc(var(--status-bar-height) + 40rpx); font-size: 40rpx; color: $font-color-dark;
}
.left-top-sign { font-size: 120rpx; color: $page-color-base; position: relative; left: -16rpx; }
.right-top-sign {
  position: absolute; top: calc(var(--status-bar-height) + 80rpx); right: -30rpx; z-index: 95;
  &:before, &:after { display: block; content: ''; width: 400rpx; height: 80rpx; background: #b4f3e2; }
  &:before { transform: rotate(50deg); border-radius: 0 50px 0 0; }
  &:after { position: absolute; right: -198rpx; top: 0; transform: rotate(-50deg); border-radius: 50px 0 0 0; }
}
.left-bottom-sign {
  position: absolute; left: -270rpx; bottom: -320rpx;
  border: 100rpx solid #d0d1fd; border-radius: 50%; padding: 180rpx;
}
.welcome {
  position: relative; left: 50rpx; top: -90rpx; font-size: 46rpx; color: #555; text-shadow: 1px 0px 1px rgba(0,0,0,0.3);
}
.input-content { padding: 0 60rpx; }
.input-item {
  display: flex; flex-direction: column; align-items: flex-start; justify-content: center;
  padding: 0 30rpx; background: $page-color-light; height: 120rpx; border-radius: 4px; margin-bottom: 30rpx;
  &:last-child { margin-bottom: 0; }
  .tit { height: 50rpx; line-height: 56rpx; font-size: $font-sm + 2rpx; color: $font-color-base; }
  input { height: 60rpx; font-size: $font-base + 2rpx; color: $font-color-dark; width: 100%; }
  .picker-input { height: 60rpx; line-height: 60rpx; font-size: $font-base + 2rpx; color: $font-color-dark; width: 100%; }
}
.confirm-btn {
  width: 630rpx; height: 76rpx; line-height: 76rpx; border-radius: 50px;
  margin-top: 50rpx; background: $uni-color-primary; color: #fff; font-size: $font-lg;
  &:after { border-radius: 100px; }
}
.bottom-links {
  display: flex; justify-content: center; gap: 60rpx; margin-top: 30rpx;
  .forgot-pwd, .register-link { font-size: 28rpx; color: $uni-color-primary; text-decoration: underline; }
}
</style>
