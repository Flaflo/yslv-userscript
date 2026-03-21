export function createPaperDialog(className: string): HTMLElement {
  const dlg = document.createElement("tp-yt-paper-dialog") as HTMLElement
  dlg.className = className
  return dlg
}

export function openPaperDialog(dlg: HTMLElement): void {
  const applyLayout = () => {
    dlg.style.display = "flex"
    dlg.style.flexDirection = "column"
    dlg.style.position = "relative"
    dlg.style.margin = "0"
  }
  const d = dlg as any
  if (typeof d.open === "function") {
    d.open()
    applyLayout()
  } else {
    customElements.whenDefined("tp-yt-paper-dialog").then(() => {
      if (typeof (dlg as any).open === "function") (dlg as any).open()
      applyLayout()
    })
  }
}

export function closePaperDialog(dlg: HTMLElement): void {
  const d = dlg as any
  if (typeof d.close === "function") d.close()
}
