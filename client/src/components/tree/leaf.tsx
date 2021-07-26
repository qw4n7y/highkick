import React from 'react'
import classnames from 'classnames'

import TreeLeaf from '../../models/tree_leaf'
import Builder from './builder'
import Leaves from './leaves'

type Props<Item> = {
  item: Item
  builder: Builder<Item>
}

type State<Item> = {
  expanded: boolean
  updatedItem: Item | undefined
}

class TreeLeafComponent<Item extends TreeLeaf> extends React.Component<Props<Item>, State<Item>> {
  constructor(props: Props<Item>) {
    super(props)

    this.state = {
      expanded: false,
      updatedItem: undefined,
    }

    this.onExpand = this.onExpand.bind(this)
  }

  render() {
    const { builder } = this.props
    const { expanded, updatedItem } = this.state

    const item = this.state.updatedItem || this.props.item

    return (
      <li className="list-group-item p-0 border-0 m-0 mb-1" key={item.digest()}>
        {React.createElement(builder, {
          item,
          onExpand: this.onExpand,
          expanded,
        })}
        <div className={classnames({'d-none': !expanded, 'mt-1 ml-4': true})}>
          <Leaves
            items={item.childs as Item[]}
            builder={builder}
          />
        </div>
      </li>)
  }

  private onExpand(expanded: boolean, updatedItem: Item | undefined) {
    this.setState({ expanded, updatedItem })
  }
}

export default TreeLeafComponent