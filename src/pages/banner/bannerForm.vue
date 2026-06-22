<template>
  <view class="content">
    <view class="form-wrap">
      <view class="form-item">
        <text class="label required">轮播图名称</text>
        <input class="input" v-model="form.name" placeholder="请输入名称" maxlength="100" />
      </view>

      <view class="form-item">
        <text class="label required">轮播图片</text>
        <view class="upload-box" @click="handleChooseImage">
          <image v-if="form.pic" :src="form.pic" class="preview-img" mode="aspectFill"></image>
          <view v-else class="upload-placeholder">
            <text class="yticon icon--add"></text>
            <text>点击上传</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="label">排序（数字越小越靠前）</text>
        <input class="input" v-model="form.sort" type="number" placeholder="默认0" />
      </view>

      <view class="form-item">
        <text class="label">链接地址</text>
        <input class="input" v-model="form.url" placeholder="例如：/pages/product/product?keyword=xxx" />
      </view>

      <view class="form-item">
        <text class="label">备注</text>
        <input class="input" v-model="form.note" placeholder="选填" />
      </view>
    </view>

    <view class="submit-btn" @click="handleSubmit">
      {{ isEdit ? '保存修改' : '添加轮播图' }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAdvertiseListAPI, createAdvertiseAPI, updateAdvertiseAPI } from '@/apis/banner'

const isEdit = ref(false)
const bannerId = ref(0)

const form = ref({
  name: '',
  pic: '',
  sort: 0,
  url: '',
  note: '',
})

onLoad(async (options: any) => {
  if (options?.id) {
    isEdit.value = true
    bannerId.value = Number(options.id)
    try {
      const res = await getAdvertiseListAPI()
      const item = (res.data || []).find((b: any) => b.id === Number(options.id))
      if (item) {
        form.value.name = item.name || ''
        form.value.pic = item.pic || ''
        form.value.sort = item.sort || 0
        form.value.url = item.url || ''
        form.value.note = item.note || ''
      }
    } catch (e) {
      console.error('加载轮播图信息失败', e)
    }
  }
})

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const tempFile = res.tempFilePaths[0]
      uni.showLoading({ title: '上传中' })
      try {
        const uploadRes = await uni.uploadFile({
          url: '/file/upload',
          filePath: tempFile,
          name: 'file',
        })
        const data = JSON.parse(uploadRes.data as string)
        if (data.code === 200) {
          form.value.pic = data.data
          uni.hideLoading()
        } else {
          uni.hideLoading()
          uni.showToast({ title: data.message || '上传失败', icon: 'none' })
        }
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '上传失败', icon: 'none' })
      }
    },
  })
}

const handleSubmit = async () => {
  if (!form.value.name) {
    uni.showToast({ title: '请输入名称', icon: 'none' })
    return
  }
  if (!form.value.pic) {
    uni.showToast({ title: '请上传图片', icon: 'none' })
    return
  }

  uni.showLoading({ title: '提交中' })
  try {
    if (isEdit.value) {
      await updateAdvertiseAPI(bannerId.value, form.value)
      uni.showToast({ title: '修改成功', icon: 'none' })
    } else {
      await createAdvertiseAPI(form.value)
      uni.showToast({ title: '添加成功', icon: 'none' })
    }
    setTimeout(() => uni.navigateBack({ delta: 1 }), 500)
  } catch (e) {
    console.error('提交失败', e)
    uni.showToast({ title: '提交失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  background: $page-color-base;
  padding-bottom: 120rpx;
}

.form-wrap {
  padding: 30rpx;
}

.form-item {
  background: #fff;
  border-radius: 10rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;

  .label {
    font-size: 28rpx;
    color: #303133;
    display: block;
    margin-bottom: 16rpx;

    &.required::before {
      content: '*';
      color: #fa436a;
      margin-right: 4rpx;
    }
  }

  .input {
    width: 100%;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }

  .upload-box {
    width: 100%;
    height: 200rpx;
    border-radius: 8rpx;
    overflow: hidden;

    .preview-img {
      width: 100%;
      height: 100%;
    }

    .upload-placeholder {
      width: 100%;
      height: 100%;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 24rpx;

      .yticon {
        font-size: 48rpx;
        margin-bottom: 8rpx;
      }
    }
  }
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  margin: 40rpx 30rpx;
  background: linear-gradient(to right, #ffac30, #fa436a);
  border-radius: 50rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}
</style>
