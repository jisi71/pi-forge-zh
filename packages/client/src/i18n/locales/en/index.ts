/**
 * English message bundle — the reference locale.
 *
 * This object's shape defines:
 *   - the full key set (`MessageKey<typeof en>`),
 *   - the plural key set (`PluralKey<typeof en>`),
 *   - the type every other locale is validated against.
 *
 * Area files are one-per-feature-area so a translation PR touches two
 * small files instead of one huge one.
 */

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

export const en = {
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
} as const;

export type EnMessages = typeof en;
