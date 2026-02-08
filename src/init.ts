import { CFG } from "./config"
import { createApp } from "./app"
import { createDescStoreState, createShimmerState, createState } from "./state"

export function initYSLV() {
  const state = createState()
  const shimmer = createShimmerState()
  const store = createDescStoreState()

  const app = createApp(CFG, state, shimmer, store)
  app.init()
}
