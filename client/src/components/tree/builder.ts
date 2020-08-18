import React from 'react'

export type Props<Item> = {
  item: Item
  onExpand: (expanded:  boolean) => any
  expanded: boolean
}

type LeafBuilder<Item> = React.FC<Props<Item>> | React.ComponentClass<Props<Item>>

export default LeafBuilder