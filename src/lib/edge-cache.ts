import { configId, configFromId, type ThemeConfig } from "@/design-system/config";

/**
 * Responses are a pure function of the URL and only change on deploy, so let a CDN keep them for a day
 * and serve stale copies for a week while it refreshes. Browsers re-check hourly.
 */
export const edgeCacheHeaders = {
  "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
};

/**
 * Resolves `<id><ext>` to a config. Ids that decode to a config but aren't in canonical form (junk keys, wrong order,
 * out-of-range values) redirect to the canonical id, so random variants can't each become a fresh CDN cache entry.
 */
export function resolveConfigItem(request: Request, item: string, ext: string): ThemeConfig | Response {
  if (!item.endsWith(ext)) return notFound();
  const id = item.slice(0, -ext.length);
  const config = configFromId(id);
  if (!config) return notFound();
  if (id !== "cards") {
    const canonical = configId(config);
    if (canonical !== id) {
      const url = new URL(request.url);
      url.pathname = url.pathname.slice(0, -item.length) + canonical + ext;
      // A body (not an empty 308) lets the CDN cache the redirect.
      return new Response("Redirecting", { status: 308, headers: { Location: url.pathname + url.search, ...edgeCacheHeaders } });
    }
  }
  return config;
}

const notFound = () => new Response("Not found", { status: 404, headers: edgeCacheHeaders });
