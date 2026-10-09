import { useEffect } from "react";

const SITE_NAME = "دیجی‌پی";

/**
 * Sets the browser tab title.
 *   usePageTitle("فروشگاه‌ها")  ->  "فروشگاه‌ها | دیجی‌پی"
 *   usePageTitle()              ->  "دیجی‌پی"
 * The previous title is restored when the page unmounts.
 */
export function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}