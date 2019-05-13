interface TreeLeaf {
  id: number
  childs: TreeLeaf[]

  isRoot: () => boolean
  parentID: () => number | null
}

export default TreeLeaf