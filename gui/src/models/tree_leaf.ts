interface TreeLeaf {
  id: number
  childs: TreeLeaf[]

  isRoot: () => boolean
  parentID: () => number | null
  digest: () => string
}

export default TreeLeaf