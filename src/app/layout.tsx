import type { Metadata } from "next";
import { defaultConfig, fontStylesheets } from "@/design-system/config";
import { siteUrl, systemName } from "@/design-system/guidelines";
import { generateChromeCss, generateThemeCss } from "@/design-system/tokens";
import { getGithubStars } from "@/lib/github";
import { StudioShell } from "@/components/studio/studio";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${systemName} — design system studio`,
  description: "Customize the design system and copy a prompt that applies it anywhere.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const stars = await getGithubStars();
  return (
    <html lang="en" className="motion-safe:scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {fontStylesheets(defaultConfig).map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {/* Default tokens for first paint; the studio overrides them client-side. */}
        <style dangerouslySetInnerHTML={{ __html: generateThemeCss(defaultConfig) }} />
        {/* The customizer sidebar always renders in the default design. */}
        <style dangerouslySetInnerHTML={{ __html: generateChromeCss() }} />
        <script defer data-domain="cards.uidesigncourse.com" src="https://analytics.ultralinxnetwork.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js" />
        <script dangerouslySetInnerHTML={{ __html: "window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }" }} />
      </head>
      <body>
        <StudioShell stars={stars}>{children}</StudioShell>
      </body>
    </html>
  );
}
