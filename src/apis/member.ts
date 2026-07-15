import { http } from '@/utils/http'
import type { LoginResult, MemberInfo, LoginParam, RegisterQuestionParam } from '@/types/member'

/** 登录 */
export const loginAPI = (data: LoginParam) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/sso/login',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    data,
  })
}

/** 获取用户信息 */
export const getMemberInfoAPI = () => {
  return http<MemberInfo>({
    method: 'GET',
    url: '/sso/info',
  })
}

/** 密码+密保注册（无需验证码） */
export const registerWithQuestionAPI = (data: RegisterQuestionParam) => {
  return http({
    method: 'POST',
    url: '/sso/registerWithQuestion',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    data,
  })
}

/** 获取密保问题 */
export const getQuestionAPI = (telephone: string) => {
  return http<string>({
    method: 'GET',
    url: '/sso/getQuestion',
    params: { telephone },
  })
}

/** 通过密保重置密码 */
export const resetPasswordByQuestionAPI = (telephone: string, answer: string, password: string) => {
  return http({
    method: 'POST',
    url: '/sso/resetPasswordByQuestion',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    data: { telephone, answer, password },
  })
}
