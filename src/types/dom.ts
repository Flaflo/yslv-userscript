export type MovedNodeInfo = {
  parent: Node
  nextSibling: ChildNode | null
}

export type MovedAvatarInfo = MovedNodeInfo & {
  avatarEl: Element
}

export type MovedMetaAnchorInfo = MovedNodeInfo & {
  a: HTMLAnchorElement
}
