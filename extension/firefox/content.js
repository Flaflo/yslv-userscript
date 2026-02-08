(() => {
  const rt = typeof browser !== "undefined" && browser?.runtime ? browser.runtime : chrome.runtime
  const url = rt.getURL("injected.js")

  const s = document.createElement("script")
  s.src = url
  s.type = "text/javascript"
  s.async = false

  ;(document.head || document.documentElement).appendChild(s)
  s.onload = () => s.remove()
})()
