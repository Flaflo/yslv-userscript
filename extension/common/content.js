(() => {
  "use strict"

  const runtime = typeof browser !== "undefined" && browser.runtime ? browser.runtime : chrome.runtime
  const url = runtime.getURL("injected.js")

  const s = document.createElement("script")
  s.src = url
  s.type = "text/javascript"
  s.async = false

  ;(document.head || document.documentElement).appendChild(s)
  s.addEventListener("load", () => {
    s.remove()
  })
})()
