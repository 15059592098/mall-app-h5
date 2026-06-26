<template>
  <view class="content">
    <view class="form-wrap">
      <view class="form-item">
        <text class="label required">商品名称</text>
        <input class="input" v-model="form.name" placeholder="请输入商品名称" maxlength="200" />
      </view>

      <view class="form-item">
        <text class="label required">商品价格</text>
        <input class="input" v-model="form.price" type="digit" placeholder="请输入价格" />
      </view>

      <view class="form-item">
        <text class="label">商品备注</text>
        <input class="input" v-model="form.note" placeholder="选填" />
      </view>

      <view class="form-item">
        <text class="label required">商品图片（主图）</text>
        <view class="upload-box" @click="handleChooseImage">
          <image v-if="form.pic" :src="form.pic" class="preview-img" mode="aspectFill"></image>
          <view v-else class="upload-placeholder">
            <text class="yticon icon--add"></text>
            <text>点击上传</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="label">商品相册（可选，最多5张）</text>
        <view class="album-wrap">
          <view
            v-for="(img, i) in form.albumPics"
            :key="i"
            class="album-item"
          >
            <image :src="img" class="album-img" mode="aspectFill"></image>
            <text class="album-del" @click="form.albumPics.splice(i, 1)">×</text>
          </view>
          <view
            v-if="form.albumPics.length < 5"
            class="album-add"
            @click="handleChooseAlbumImages"
          >
            <text class="yticon icon--add"></text>
            <text>添加图片</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="label required">商品分类</text>
        <picker @change="handleCategoryChange" :range="categoryOptions" range-key="name">
          <view class="picker-input">{{ categoryOptions.find(c => c.id === form.productCategoryId)?.name || '请选择分类' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label required">可选尺码</text>
        <view class="tag-wrap">
          <view v-for="(tag, i) in form.sizes" :key="i" class="tag">
            <text>{{ tag }}</text>
            <text class="tag-close" @click="form.sizes.splice(i, 1)">×</text>
          </view>
          <input class="tag-input" v-model="sizeInput" placeholder="输入后点添加" @confirm="addSize" />
          <text class="tag-add" @click="addSize">添加</text>
        </view>
      </view>

      <view class="form-item">
        <text class="label required">可选颜色</text>
        <view class="tag-wrap">
          <view v-for="(tag, i) in form.colors" :key="i" class="tag">
            <text>{{ tag }}</text>
            <text class="tag-close" @click="form.colors.splice(i, 1)">×</text>
          </view>
          <input class="tag-input" v-model="colorInput" placeholder="输入后点添加" @confirm="addColor" />
          <text class="tag-add" @click="addColor">添加</text>
        </view>
      </view>
    </view>

    <view class="submit-btn" @click="handleSubmit">
      {{ isEdit ? '保存修改' : '添加商品' }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCategoryTreeAPI } from '@/apis/product'
import {
  getManageProductAPI,
  createManageProductAPI,
  updateManageProductAPI,
} from '@/apis/manageProduct'

const isEdit = ref(false)
const productId = ref(0)

const form = ref({
  name: '',
  price: '' as any,
  note: '',
  pic: '',
  albumPics: [] as string[],
  sizes: [] as string[],
  colors: [] as string[],
  productCategoryId: undefined as number | undefined,
})

const sizeInput = ref('')
const colorInput = ref('')

const categoryOptions = ref<{ id: number; name: string }[]>([])

const handleCategoryChange = (e: any) => {
  form.value.productCategoryId = categoryOptions.value[e.detail.value]?.id
}

const addSize = () => {
  const val = sizeInput.value.trim()
  if (val && !form.value.sizes.includes(val)) {
    form.value.sizes.push(val)
  }
  sizeInput.value = ''
}

const addColor = () => {
  const val = colorInput.value.trim()
  if (val && !form.value.colors.includes(val)) {
    form.value.colors.push(val)
  }
  colorInput.value = ''
}

onLoad(async (options: any) => {
  // 加载分类列表
  try {
    const catRes = await getCategoryTreeAPI()
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
    console.error('加载分类失败', e)
  }

  if (options?.id) {
    isEdit.value = true
    productId.value = Number(options.id)
    try {
      const res = await getManageProductAPI(productId.value)
      const data = res.data
      form.value.name = data.product.name || ''
      form.value.price = data.product.price || ''
      form.value.note = data.product.note || ''
      form.value.pic = data.product.pic || ''
      form.value.albumPics =
        data.product.albumPics
          ? data.product.albumPics.split(',').filter((s: string) => s.trim())
          : []
      form.value.sizes = data.sizes || []
      form.value.colors = data.colors || []
      form.value.productCategoryId = data.product.productCategoryId || undefined
    } catch (e) {
      console.error('加载商品信息失败', e)
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
        } else {
          uni.showToast({ title: data.message || '上传失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '上传失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  })
}

const handleChooseAlbumImages = () => {
  const remain = 5 - form.value.albumPics.length
  if (remain <= 0) return

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = async () => {
    const files = Array.from(input.files || []).slice(0, remain)
    if (files.length === 0) return
    uni.showLoading({ title: '上传中...' })
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    const token = uni.getStorageSync('token') || ''
    for (const file of files) {
      try {
        const uploadRes: any = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', apiBase + '/file/upload')
          if (token) xhr.setRequestHeader('Authorization', token)
          const fd = new FormData()
          fd.append('file', file)
          xhr.onload = () => resolve({ data: xhr.responseText })
          xhr.onerror = reject
          xhr.send(fd)
        })
        const data = JSON.parse(uploadRes.data)
        if (data.code === 200) {
          form.value.albumPics.push(data.data)
        }
      } catch (e) {
        console.error('上传图片失败', e)
      }
    }
    uni.hideLoading()
  }
  input.click()
}

const handleSubmit = async () => {
  if (!form.value.name) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' })
    return
  }
  if (!form.value.price || form.value.price <= 0) {
    uni.showToast({ title: '请输入商品价格', icon: 'none' })
    return
  }
  if (!form.value.pic) {
    uni.showToast({ title: '请上传商品图片', icon: 'none' })
    return
  }
  if (!form.value.productCategoryId) {
    uni.showToast({ title: '请选择商品分类', icon: 'none' })
    return
  }
  if (form.value.sizes.length === 0 && form.value.colors.length === 0) {
    uni.showToast({ title: '请至少添加一个尺码或颜色', icon: 'none' })
    return
  }

  uni.showLoading({ title: '提交中' })
  try {
    const data = {
      name: form.value.name,
      price: Number(form.value.price),
      note: form.value.note,
      pic: form.value.pic,
      albumPics: form.value.albumPics,
      sizes: form.value.sizes,
      colors: form.value.colors,
      productCategoryId: form.value.productCategoryId,
    }

    if (isEdit.value) {
      await updateManageProductAPI(productId.value, data)
      uni.showToast({ title: '修改成功', icon: 'none' })
    } else {
      await createManageProductAPI(data)
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

  .picker-input {
    height: 72rpx;
    line-height: 72rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
  }

  .upload-box {
    width: 200rpx;
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

  .album-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .album-item {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
      overflow: hidden;
      position: relative;

      .album-img {
        width: 100%;
        height: 100%;
      }

      .album-del {
        position: absolute;
        top: 4rpx;
        right: 4rpx;
        width: 32rpx;
        height: 32rpx;
        line-height: 32rpx;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        border-radius: 50%;
        font-size: 24rpx;
      }
    }

    .album-add {
      width: 160rpx;
      height: 160rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 22rpx;

      .yticon {
        font-size: 40rpx;
        margin-bottom: 4rpx;
      }
    }
  }

  .tag-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    align-items: center;
  }

  .tag {
    display: flex;
    align-items: center;
    background: #e8f8f0;
    color: #5fcda2;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 6rpx;

    .tag-close {
      margin-left: 8rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .tag-input {
    width: 160rpx;
    height: 56rpx;
    background: #f5f5f5;
    border-radius: 6rpx;
    padding: 0 12rpx;
    font-size: 24rpx;
  }

  .tag-add {
    font-size: 24rpx;
    color: #fa436a;
    padding: 8rpx 16rpx;
    border: 1rpx solid #fa436a;
    border-radius: 6rpx;
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
