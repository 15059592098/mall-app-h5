/**
 * 用户基本信息
 */
export type MemberInfo = {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname?: string
  /** 头像 */
  icon?: string
  /** 积分 */
  integration?: number
  /** 成长值 */
  growth?: number
  /** 个性签名（存储密保信息） */
  personalizedSignature?: string
}

/** 登录接口返回结果 */
export type LoginResult = {
  /** Token 前缀（如 "Bearer "） */
  tokenHead: string
  /** 登录凭证 */
  token: string
}

/** 登录请求参数 */
export type LoginParam = {
  /** 账户名 */
  username: string
  /** 密码 */
  password: string
}

/** 注册请求参数（密码+密保方式） */
export type RegisterQuestionParam = {
  /** 账户名 */
  username: string
  /** 密码 */
  password: string
  /** 手机号 */
  telephone: string
  /** 密保问题 */
  question: string
  /** 密保答案 */
  answer: string
}
