import { cacheLife } from "next/cache";
import { repoUrl } from "@/design-system/guidelines";

/** The repo's star count, refreshed about hourly. Any failure counts as 0, which hides the number. */
export async function getGithubStars() {
  "use cache";
  cacheLife("hours");
  try {
    const repo = repoUrl.replace("https://github.com/", "");
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return 0;
    const { stargazers_count: stars } = (await res.json()) as { stargazers_count?: number };
    return stars ?? 0;
  } catch {
    return 0;
  }
}
