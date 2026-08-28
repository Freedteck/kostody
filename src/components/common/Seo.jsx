import { useEffect } from "react";

const SITE_URL = "https://kostody.vercel.app";
const DEFAULT_TITLE = "Kostody . Proof at every step, for every repair in Nigeria";
const DEFAULT_DESC =
  "Track repairs with time-stamped condition photos, fixed quotes, and 4-digit PIN authorization. No arguments, just proof.";
const DEFAULT_IMAGE = `${SITE_URL}/apple-touch-icon.png`;

const Seo = ({
  title,
  description = DEFAULT_DESC,
  path = "",
  image = DEFAULT_IMAGE,
}) => {
  useEffect(() => {
    const pageTitle = title ? `${title} | Kostody` : DEFAULT_TITLE;
    const pageUrl = `${SITE_URL}${path}`;

    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const [attrName, attrVal] = selector
          .replace("meta[", "")
          .replace("]", "")
          .split("=");
        element.setAttribute(attrName, attrVal.replace(/"/g, ""));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Standard meta tags
    setMetaTag('meta[name="description"]', "content", description);

    // Open Graph / Facebook / WhatsApp
    setMetaTag('meta[property="og:title"]', "content", pageTitle);
    setMetaTag('meta[property="og:description"]', "content", description);
    setMetaTag('meta[property="og:url"]', "content", pageUrl);
    setMetaTag('meta[property="og:image"]', "content", image);
    setMetaTag('meta[property="og:type"]', "content", "website");

    // Twitter
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "content", pageTitle);
    setMetaTag('meta[name="twitter:description"]', "content", description);
    setMetaTag('meta[name="twitter:image"]', "content", image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);
  }, [title, description, path, image]);

  return null;
};

export default Seo;
