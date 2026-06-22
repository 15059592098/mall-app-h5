<template>
  <view class="container">
    <view class="wrapper">
      <view class="empty">
        <view class="empty-icon">📱</view>
        <view class="empty-tips">
          本店使用手机号验证登录
        </view>
        <view class="empty-tips2">
          输入手机号获取验证码即可自动注册/登录
        </view>
        <button class="confirm-btn" @click="goLogin">
          去登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const goLogin = () => {
  uni.redirectTo({ url: '/pages/public/login' })
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

.empty {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  padding-bottom: 100rpx;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .empty-tips {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
  }

  .empty-tips2 {
    font-size: 26rpx;
    color: #999;
  }
}

.confirm-btn {
  width: 400rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 50px;
  margin-top: 60rpx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;

  &:after {
    border-radius: 100px;
  }
}
</style>
