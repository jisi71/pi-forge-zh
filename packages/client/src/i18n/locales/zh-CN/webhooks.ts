/**
 * 简体中文 — webhooks 区域文案。
 *
 * 英文原文见 `../en/webhooks.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 保留原文不译：Webhook 的 URL、`webhook.test` 事件名、HTTP 请求头名、
 * `X-Pi-Forge-Signature`、`***REDACTED***` 占位符、错误码，以及以等宽
 * 字体展示的原始 `WebhookEvent` 标识。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const webhooks: DeepPartial<EnMessages["webhooks"]> = {
  introPrefix:
    "Webhook 会在代理或会话事件发生时，向你配置的 URL 发送 HTTP POST 请求，可用于 Slack 通知、CI 集成、审计日志等场景。存储于",
  introSuffix: "。",
  newWebhook: "+ 新建 Webhook",
  empty: "尚未配置任何 Webhook。",

  events: {
    agentEnd: "代理完成一轮对话",
    askUserQuestion: "代理提问（等待用户回答）",
    processAlert: "后台进程已退出",
    autoRetryEnd: "自动重试次数已用尽（提供商故障）",
    compactionEnd: "上下文压缩已完成",
    sessionCreated: "会话已创建",
    sessionDeleted: "会话已删除",
  },

  draft: {
    editTitle: "编辑 Webhook",
    newTitle: "新建 Webhook",
    urlLabel: "URL（仅支持 HTTPS）",
    eventsLegend: "事件",
    scopeLegend: "作用范围",
    scopeGlobal: "全局（所有项目）",
    scopeProject: "指定项目：",
    // 英文原文末尾带一个空格，用于与下面的提示语分隔；中文不需要该空格。
    secretLabel: "HMAC 密钥（可选）",
    secretKeepHint: "— 留空则保留原有密钥",
    secretPlaceholderUnchanged: "（保持不变）",
    secretPlaceholder: "用于 X-Pi-Forge-Signature 的共享密钥",
    headersLabelPrefix: "自定义请求头（可选，每行一个，格式",
    headersLabelSuffix: "）",
    headersMaskedPrefix: "为安全起见，已存储的值会显示为",
    headersMaskedSuffix:
      "。保留含有该占位符的行即可保持原值；替换该占位符即可更新；删除整行即可移除该请求头。",
    insecureTlsLabel: "允许自签名 / 无效的 TLS 证书",
    insecureTlsHint:
      "⚠ 会关闭 MITM 防护。仅适用于使用已知自签名证书的内部主机。每次触发都会写入 stderr，便于运维在日志中发现此类放宽的安全配置。",
    enabledLabel: "启用（禁用可在不丢失配置的情况下暂停）",
    saveChanges: "保存修改",
    createWebhook: "创建 Webhook",
  },

  row: {
    scopeGlobal: "全局",
    scopeProject: "项目：{name}",
    signedBadge: "已签名",
    insecureTlsBadge: "不安全 TLS",
    insecureTlsBadgeTooltip: "此 Webhook 已关闭 TLS 证书校验",
    testButton: "测试",
    testTooltip: "向此 Webhook 发送一个合成的 webhook.test 事件",
    deleteTooltip: "删除此 Webhook",
    hideDeliveries: "隐藏投递记录",
    showDeliveries: "查看最近投递记录",
  },

  deliveries: {
    title: "最近投递",
    titleWithCount: "最近投递（{count}）",
    empty: "暂无投递记录。",
  },
};
