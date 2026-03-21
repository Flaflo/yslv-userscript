export interface Toggle {
  el: Element
  checked: boolean
  onChange(fn: () => void): void
}

const HAS_YT_TOGGLE = typeof customElements !== "undefined" && !!customElements.get("tp-yt-paper-toggle-button")

export function createToggle(): Toggle {
  if (HAS_YT_TOGGLE) {
    const toggle = document.createElement("tp-yt-paper-toggle-button") as any
    return {
      el: toggle,
      get checked(): boolean {
        return !!toggle.checked
      },
      set checked(v: boolean) {
        toggle.checked = v
      },
      onChange(fn: () => void): void {
        toggle.addEventListener("change", fn)
        toggle.addEventListener("checked-changed", fn)
        toggle.addEventListener("iron-change", fn)
      },
    }
  }

  const input = document.createElement("input")
  input.type = "checkbox"
  const wrap = document.createElement("label")
  wrap.className = "yslv-m-pill"
  wrap.appendChild(input)
  input.addEventListener("change", () => {
    wrap.classList.toggle("checked", input.checked)
  })

  return {
    el: wrap,
    get checked(): boolean {
      return input.checked
    },
    set checked(v: boolean) {
      input.checked = v
      wrap.classList.toggle("checked", v)
    },
    onChange(fn: () => void): void {
      input.addEventListener("change", fn)
    },
  }
}
