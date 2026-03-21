export type SkeletonNorm = {
  enabled: boolean
  lines: number
  gap: number
  h: (i: number) => number
  w: (i: number) => number
  r: number
  maxW: number
  ms: number
}
