import { Fragment } from "react";
import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { Hero } from "~/components/sections/Hero";
import { getActiveSections, sectionRegistry, type SiteData } from "~/config/sections";
import { EPK_PDF_PATH } from "~/config/site";
import { aboutHtml, content } from "~/lib/content.server";
import { findImage, heroImages } from "~/lib/images";
import type { Route } from "./+types/home";

/**
 * Runs at build time only (prerender). Content is validated here, so broken
 * content fails the build, and zod/marked never ship to the browser.
 */
export function loader(): SiteData {
  return { content, aboutHtml };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const { artist } = loaderData.content;
  const hero = findImage(heroImages, artist.heroImage);
  const image = hero ? new URL(hero.src, artist.seo.siteUrl).href : undefined;
  return [
    { title: artist.seo.title },
    { name: "description", content: artist.seo.description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: artist.seo.title },
    { property: "og:description", content: artist.seo.description },
    { property: "og:url", content: artist.seo.siteUrl },
    ...(image ? [{ property: "og:image", content: image }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { tagName: "link", rel: "canonical", href: artist.seo.siteUrl },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { artist, socials } = loaderData.content;
  const sections = getActiveSections(loaderData);
  // The dropdown also offers the PDF directly, so skip the in-page download band there
  const epkItems = sections.filter((s) => s.id !== "download");

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <Header
        artistName={artist.name}
        epkItems={[...epkItems, { id: "download", label: "Download EPK", href: EPK_PDF_PATH }]}
        socials={socials}
      />
      <main id="main">
        <Hero artist={artist} image={findImage(heroImages, artist.heroImage)} />
        {sections.map(({ id, label }) => (
          <Fragment key={id}>{sectionRegistry[id].render(loaderData, id, label)}</Fragment>
        ))}
      </main>
      <Footer artistName={artist.name} email={artist.email} socials={socials} />
    </>
  );
}
