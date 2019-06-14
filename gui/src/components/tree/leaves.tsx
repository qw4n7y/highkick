import React from 'react'
import classnames from 'classnames'

import TreeLeafInterface from '../../models/tree_leaf'
import Builder from './builder'
import Leaf from './leaf'

type Props<Item> = {
  items: Item[]
  builder: Builder<Item>
}

class TreeLeaves<Item extends TreeLeafInterface> extends React.Component<Props<Item>> {
  render() {
    const { items, builder } = this.props

    return (
      <ul className={classnames('list-group', 'p-0')}>
        { items.map(item => {
          return (
            <Leaf
              key={item.digest()}
              item={item}
              builder={builder}
            />)
        }) }
      </ul>)
  }
}

export default TreeLeaves