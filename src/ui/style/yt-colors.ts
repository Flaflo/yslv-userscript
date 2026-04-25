const VAR_TEXT_PRIMARY = "--yslv-yt-text-primary"
const VAR_BASE_BG = "--yslv-yt-base-bg"

const DARK_TEXT_PRIMARY = "#f1f1f1"
const DARK_BASE_BG = "#0f0f0f"
const LIGHT_TEXT_PRIMARY = "#0f0f0f"
const LIGHT_BASE_BG = "#ffffff"

function applyTheme(): void {
  const root = document.documentElement
  const dark = root.hasAttribute("dark")
  root.style.setProperty(VAR_TEXT_PRIMARY, dark ? DARK_TEXT_PRIMARY : LIGHT_TEXT_PRIMARY)
  root.style.setProperty(VAR_BASE_BG, dark ? DARK_BASE_BG : LIGHT_BASE_BG)
}

let observer: MutationObserver | null = null

export function initYouTubeColors(): void {
  applyTheme()

  if (observer) return

  observer = new MutationObserver(applyTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dark", "darker-dark-theme"],
  })
}
