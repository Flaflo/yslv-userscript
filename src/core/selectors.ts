export const TAG_RICH_ITEM = "YTD-RICH-ITEM-RENDERER"

export const SEL_SUBS_BROWSE_PM = 'ytd-page-manager ytd-browse[page-subtype="subscriptions"]:not([hidden])'
export const SEL_SUBS_BROWSE = 'ytd-browse[page-subtype="subscriptions"]:not([hidden])'

export const SEL_RICH_GRID_CONTENTS = "ytd-rich-grid-renderer #contents"
export const SEL_RICH_GRID = "ytd-rich-grid-renderer"

export const SEL_PAGE_MANAGER = "ytd-page-manager"

export const SEL_RICH_ITEM = "ytd-rich-item-renderer"

export const SEL_SHORTS_LOCKUP = "ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model"

export const SEL_LOCKUP = "yt-lockup-view-model"

export const SEL_TEXT_CONTAINER = ".yt-lockup-metadata-view-model__text-container"
export const SEL_TEXT_CONTAINER_FALLBACK = "yt-lockup-metadata-view-model"

export const SEL_HEADING_RESET = ".yt-lockup-metadata-view-model__heading-reset"

export const SEL_AVATAR = ".yt-lockup-metadata-view-model__avatar"

export const SEL_CH_ANCHOR_META_HANDLE =
  'yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/@"]'
export const SEL_CH_ANCHOR_META_ID =
  'yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/channel/"]'

export const SEL_CH_ANCHOR_HANDLE = 'a[href^="/@"]'
export const SEL_CH_ANCHOR_ID = 'a[href^="/channel/"]'

export const SEL_CH_TEXT_SPAN =
  "yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row span.yt-content-metadata-view-model__metadata-text"

export const SEL_METADATA_ROW = "yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row"

export const SEL_ICON_SHAPE = "yt-icon-shape, .yt-icon-shape"

export const SEL_BADGE_CANDIDATES =
  ".yt-core-attributed-string__image-element, .ytIconWrapperHost, .yt-core-attributed-string__image-element--image-alignment-vertical-center, yt-icon-shape, .yt-icon-shape"

export const SEL_BADGE_ROOT_IMAGE_EL = ".yt-core-attributed-string__image-element"
export const SEL_BADGE_ROOT_ICON_HOST = ".ytIconWrapperHost"
export const SEL_BADGE_ROOT_VERTICAL = ".yt-core-attributed-string__image-element--image-alignment-vertical-center"

export const SEL_VIDEO_ANCHORS: readonly string[] = [
  'a.yt-lockup-view-model__content-image[href^="/watch"]',
  'a.yt-lockup-view-model__content-image[href^="/shorts/"]',
  'a[href^="/watch"][id="thumbnail"]',
  'a[href^="/shorts/"][id="thumbnail"]',
  'a[href^="/shorts/"].reel-item-endpoint',
  'a[href^="/watch"]',
  'a[href^="/shorts/"]',
]
