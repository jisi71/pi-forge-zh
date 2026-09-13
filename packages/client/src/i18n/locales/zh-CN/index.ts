/**
 * 简体中文语言包。
 *
 * 每个区域文件都对照 `../en/<area>.ts` 的类型声明，缺少的键在运行时
 * 自动回退到英文；英文文件新增键后这里不补也不会导致界面空白。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";
import { app } from "./app";
import { auth } from "./auth";
import { chatInput } from "./chatInput";
import { chatView } from "./chatView";
import { common } from "./common";
import { errors } from "./errors";
import { files } from "./files";
import { git } from "./git";
import { orchestration } from "./orchestration";
import { projects } from "./projects";
import { sessions } from "./sessions";
import { settings } from "./settings";
import { terminal } from "./terminal";
import { webhooks } from "./webhooks";

export const zhCN: DeepPartial<EnMessages> = {
  common,
  app,
  auth,
  projects,
  sessions,
  chatView,
  chatInput,
  files,
  git,
  terminal,
  orchestration,
  settings,
  webhooks,
  errors,
};
