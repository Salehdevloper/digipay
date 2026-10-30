import { CHARM_MASHHAD_BRANCHES } from "./charm-mashhad";
import {PIERRE_CARDIN_BRANCHES} from "./pierre-cardin";
import {IC_WAIKIKI_BRANCHES} from "./lc-waikiki";

/* =========================================================
   Branches of the stores that have shops: ONE FILE PER STORE.
   A store without a file here simply has no «آدرس شعب حضوری» section.

   New store:  copy charm-mashhad.js, rename it, add it below.

   Branch fields:
     id        unique inside the store
     name      branch name       («ونک»)
     address   address text
     mapUrl    the link of «مسیریابی» (a Google Maps / Neshan / Balad link);
               opens in a NEW tab
     lat, lng  optional: instead of mapUrl, a Google Maps route to this point
               is made. Without mapUrl and lat/lng the «مسیریابی» link is hidden.
========================================================= */

export const BRANCHES_BY_STORE = {
  "charm-mashhad": CHARM_MASHHAD_BRANCHES,
  "pierre-cardin" : PIERRE_CARDIN_BRANCHES,
  "lc-waikiki" : IC_WAIKIKI_BRANCHES,
};

/** How many branches the store page shows before «مشاهده همه». */
export const BRANCH_PREVIEW_COUNT = 9;

export const getStoreBranches = (storeId) => BRANCHES_BY_STORE[storeId] ?? [];

/** Link of «مسیریابی» (null = no link). */
export const getBranchLink = ({ mapUrl, lat, lng }) => {
  if (mapUrl) return mapUrl;

  return lat != null && lng != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : null;
};