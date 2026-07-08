import { unstable_createDevServer } from "@remix-run/cloudflare-pages";

if (process.env.NODE_ENV === "development") {
  await unstable_createDevServer({
    liveReload: true,
  });
}
