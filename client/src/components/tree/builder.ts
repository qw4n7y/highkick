import React from 'react'

type Props<Item> = {
  item: Item
  expandTreeLeaf: () => any
}

type LeafBuilder<Item> = React.FC<Props<Item>>

export default LeafBuilder