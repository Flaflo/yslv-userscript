export const TAG_RICH_ITEM = "YTD-RICH-ITEM-RENDERER"

/** YouTube page structure selectors */
export const SEL_PAGE = {
  subsBrowsePm: 'ytd-page-manager ytd-browse[page-subtype="subscriptions"]:not([hidden])',
  subsBrowse: 'ytd-browse[page-subtype="subscriptions"]:not([hidden])',
  richGridContents: "ytd-rich-grid-renderer #contents",
  richGrid: "ytd-rich-grid-renderer",
  pageManager: "ytd-page-manager",
  richItem: "ytd-rich-item-renderer",
} as const

/** YouTube lockup element selectors */
export const SEL_LOCKUP = {
  root: "yt-lockup-view-model",
  textContainer: ".yt-lockup-metadata-view-model__text-container",
  textContainerFallback: "yt-lockup-metadata-view-model",
  headingReset: ".yt-lockup-metadata-view-model__heading-reset",
  avatar: ".yt-lockup-metadata-view-model__avatar",
  metadataRow: "yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row",
  shortsLockup: "ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model",
} as const

/** YouTube channel link selectors */
export const SEL_CHANNEL = {
  anchorMetaHandle: 'yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/@"]',
  anchorMetaId: 'yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/channel/"]',
  anchorHandle: 'a[href^="/@"]',
  anchorId: 'a[href^="/channel/"]',
  textSpan:
    "yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row span.yt-content-metadata-view-model__metadata-text",
} as const

/** YouTube badge / verification icon selectors */
/** YouTube video thumbnail link selectors (ordered by specificity) */
export const SEL_VIDEO_ANCHORS: readonly string[] = [
  'a.yt-lockup-view-model__content-image[href^="/watch"]',
  'a.yt-lockup-view-model__content-image[href^="/shorts/"]',
  'a[href^="/watch"][id="thumbnail"]',
  'a[href^="/shorts/"][id="thumbnail"]',
  'a[href^="/shorts/"].reel-item-endpoint',
  'a[href^="/watch"]',
  'a[href^="/shorts/"]',
]

/** Internal selectors for CSS classes injected by the userscript */
export const SEL_YSLV = {
  rowHead: "yslv-subs-rowhead",
  rowHeadName: "yslv-subs-rowhead-name",
  metaRow: "yslv-subs-mrow",
  metaCh: "yslv-subs-mch",
  metaRt: "yslv-subs-mrt",
  desc: "yslv-subs-desc",
  descSkel: "yslv-subs-desc-skel",
  isShort: "yslv-is-short",
  patched: "yslv-patched",
} as const
