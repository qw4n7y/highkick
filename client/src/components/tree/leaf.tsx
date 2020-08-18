import React from 'react'
import classnames from 'classnames'

import TreeLeaf from '../../models/tree_leaf'
import Builder from './builder'
import Leaves from './leaves'

type Props<Item> = {
  item: Item
  builder: Builder<Item>
}

type State = {
  expanded: boolean
}

class TreeLeafComponent<Item extends TreeLeaf> extends React.Component<Props<Item>, State> {
  constructor(props: Props<Item>) {
    super(props)

    this.state = {
      expanded: false
    }

    this.onExpand = this.onExpand.bind(this)
  }

  render() {
    const { item, builder } = this.props
    const { expanded } = this.state

    return (
      <li className="list-group-item pr-0" key={item.digest()}>
        {React.createElement(builder, {
          item,
          onExpand: this.onExpand,
          expanded
        })}
        <div className={classnames({'d-none': !expanded})}>
          <Leaves
            items={item.childs as Item[]}
            builder={builder}
          />
        </div>
      </li>)
  }

  private onExpand(expanded: boolean) {
    this.setState({ expanded })
  }
}

export default TreeLeafComponent