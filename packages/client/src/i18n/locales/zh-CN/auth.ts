/**
 * auth — 简体中文文案。
 *
 * 英文原文见 `../en/auth.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 服务端返回的错误码（`invalid_password`、`username_required` 等）是标识符，
 * 不翻译；只翻译其外围的提示语句。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const auth: DeepPartial<EnMessages["auth"]> = {
  login: {
    subtitleLdap: "请使用 LDAP 账户登录。",
    subtitlePassword: "请输入 {appName} 访问密码以继续。",
    // 字段标签复用 common.username / common.password，提交按钮复用 common.signIn。
    submitting: "正在登录…",
    bannerAriaLabel: "登录提示",
    errorInvalidCredentialsLdap: "用户名、密码或 LDAP 组不正确。",
    errorInvalidPassword: "密码不正确。",
    errorUsernameRequired: "请输入用户名。",
    errorFailed: "登录失败：{code}",
  },

  changePassword: {
    title: "设置新密码",
    subtitle:
      "你使用的是部署时提供的初始密码。请先设置新密码再继续 —— 新密码将以哈希形式保存在 {appName} 数据卷中。",
    currentLabel: "当前密码",
    newLabel: "新密码",
    confirmLabel: "确认新密码",
    submit: "设置新密码",
    // 进行中与退出登录的文案复用 common.saving / common.signOut。
    errorTooShort: "新密码至少需要 {min} 个字符",
    errorMismatch: "两次输入的新密码不一致",
    errorSameAsCurrent: "新密码不能与当前密码相同",
    remoteIncorrectCurrent: "当前密码不正确。",
    remotePasswordUnchanged: "新密码不能与当前密码相同。",
    remoteNotConfigured: "此服务端未配置密码登录。",
    remoteSessionExpired: "会话已过期 —— 请重新登录。",
    remoteFailed: "无法修改密码：{code}",
  },
};
