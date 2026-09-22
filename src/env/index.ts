import { createEnv } from "@t3-oss/env-core"
import { createExtensionClientEnvSchema, resolveExtensionEnv } from "./shared"

// This fork has no required hosted backend. Optional values can still be
// supplied by a self-hosted deployment, but an unpacked local build must never
// require upstream analytics or OAuth credentials.
const shouldSkipRequiredProductionEnv = true
const extensionClientEnvSchema = createExtensionClientEnvSchema(
  import.meta.env.PROD,
  shouldSkipRequiredProductionEnv,
)

export const env = createEnv({
  clientPrefix: "WXT_",
  client: extensionClientEnvSchema,
  runtimeEnv: resolveExtensionEnv(import.meta.env),
  emptyStringAsUndefined: true,
})
