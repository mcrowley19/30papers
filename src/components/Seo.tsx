import { useEffect } from "react";
import type { PageMeta } from "../lib/seo";
import { SITE, absoluteUrl } from "../lib/site";

function upsertMeta(
  selector: string,
  attrs: Record<string, string>,
  createTag: "meta" | "link" = "meta"
) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(createTag);
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
}

function setJsonLd(data: PageMeta["jsonLd"]) {
  const id = "seo-jsonld";
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.setAttribute("type", "application/ld+json");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Updates document head tags for the current route. */
export default function Seo({
  title,
  description,
  path,
  image,
  type,
  noindex,
  jsonLd,
}: PageMeta) {
  useEffect(() => {
    const url = absoluteUrl(path);
    const imageUrl = image ? absoluteUrl(image) : undefined;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    });
    upsertMeta('link[rel="canonical"]', { rel: "canonical", href: url }, "link");

    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE.name });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type ?? "website",
    });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });

    if (imageUrl) {
      upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: imageUrl ? "summary_large_image" : "summary",
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });

    setJsonLd(jsonLd);
  }, [title, description, path, image, type, noindex, jsonLd]);

  return null;
}
