import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

export interface Env {
  DB: D1Database;
}

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler<Env>({
  build,
  getLoadContext: (context) => ({ env: context.env }),
  mode: process.env.NODE_ENV,
});
