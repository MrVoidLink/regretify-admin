import type { StoryOutlineLink } from "@/components/market-pulse/composer/types";

export function formatPublishedAtLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function stripHtmlTags(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractOutlineLinksFromBodyHtml(bodyHtml: string): StoryOutlineLink[] {
  const headingRegex = /<h2\b[^>]*>(.*?)<\/h2>/gis;
  const links: StoryOutlineLink[] = [{ href: "#story-overview", label: "Market overview" }];
  const usedHrefs = new Set(links.map((link) => link.href));

  for (const match of bodyHtml.matchAll(headingRegex)) {
    const label = stripHtmlTags(match[1] ?? "");

    if (!label) {
      continue;
    }

    let href = `#${slugifyHeading(label) || "story-section"}`;
    let suffix = 2;

    while (usedHrefs.has(href)) {
      href = `#${slugifyHeading(label) || "story-section"}-${suffix}`;
      suffix += 1;
    }

    usedHrefs.add(href);
    links.push({ href, label });
  }

  return links;
}
