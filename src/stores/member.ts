import type { MemberInfo } from '@/types/member'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginAPI, getMemberInfoAPI, registerWithQuestionAPI } from '@/apis/member'

// 定义会员Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const memberInfo = ref<MemberInfo>()

    // 是否已登录
    const hasLogin = computed(() => !!memberInfo.value)

    // 保存会员信息，登录时使用
    const setMemberInfo = (val: MemberInfo) => {
      memberInfo.value = val
    }

    // 会员登录（用户名+密码）
    const memberLogin = async (username: string, password: string) => {
      // 1. 调用登录接口获取 token
      const loginRes = await loginAPI({ username, password })

      // 2. 拼接完整 token 并存储
      const loginData = loginRes.data
      const token = `${loginData.tokenHead}${loginData.token}`
      uni.setStorageSync('token', token)

      // 3. 获取用户信息
      const memberRes = await getMemberInfoAPI()

      // 4. 保存用户信息到 Pinia
      setMemberInfo(memberRes.data)
    }

    // 手机号+密码登录（首次自动注册+设密保）
    const memberLoginByPassword = async (telephone: string, password: string, question: string, answer: string) => {
      try {
        // 先尝试登录
        await memberLogin(telephone, password)
      } catch {
        // 登录失败则注册（带密保）
        await registerWithQuestionAPI({
          username: telephone,
          password,
          telephone,
          question,
          answer,
        })
        // 注册成功后再次登录
        await memberLogin(telephone, password)
      }
    }

    // 会员退出登录
    const memberLogout = () => {
      memberInfo.value = undefined
      uni.removeStorageSync('token')
    }

    return {
      memberInfo,
      hasLogin,
      setMemberInfo,
      memberLogin,
      memberLoginByPassword,
      memberLogout,
    }
  },
  // TODO: 持久化
  {
    // 网页端用法
    // persist: true,
    // 兼容多端的用法
    persist: {
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
        getItem(key) {
          return uni.getStorageSync(key)
        },
      },
    },
  },
)
