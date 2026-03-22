import type { ViewMode } from "./state"

export type UserSettings = {
  defaultView: ViewMode
  thumbW: number
  thumbRadius: number
  maxWidth: number | string
  titleClamp: number
  descClamp: number
  hideMostRelevant: boolean
  hideShorts: boolean
  hideMiniGuide: boolean
  fetchDesc: boolean
  sentenceCount: number
  maxDescChars: number
  showSkeleton: boolean
  separator: boolean
  avatarSize: number
}
