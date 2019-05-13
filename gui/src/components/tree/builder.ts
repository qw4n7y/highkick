import React from 'react'

type Props<Item> = {
  item: Item
  onItemUpdate: (item: Item) => any
}

type LeafBuilder<Item> = React.FC<Props<Item>>

export default LeafBuilder