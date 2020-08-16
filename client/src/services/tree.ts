import TreeLeaf from '../models/tree_leaf'

function compose<Item extends TreeLeaf>(params: {
  rootId: number,
  items: Item[]
}) {
  const { rootId, items } = params

  const root = items.find(i => i.id === rootId)
  if (!root) {
    throw new Error('No root found')
  }

  const composeSubTree = (leaf: TreeLeaf) => {
    leaf.childs = items.filter(l => l.parentID() === leaf.id)
    for(const child of leaf.childs) {
      composeSubTree(child)
    }
  }

  composeSubTree(root)
  return root
}

export default { compose }