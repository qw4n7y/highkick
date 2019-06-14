import React from 'react'
import classnames from 'classnames'

import { Button } from 'react-bootstrap'

import TreeLeaf from '../../models/tree_leaf'
import Builder from './builder'
import Leaves from './leaves'

type Props<Item> = {
  item: Item
  builder: Builder<Item>
}

type State<Item> = {
  item: Item
  opened: boolean
}

class TreeLeafComponent<Item extends TreeLeaf> extends React.Component<Props<Item>, State<Item>> {
  constructor(props: Props<Item>) {
    super(props)

    this.state = {
      item: props.item,
      opened: props.item.isRoot() ? false : true
    }

    this.toggle = this.toggle.bind(this)
    this.onItemUpdate = this.onItemUpdate.bind(this)
  }

  render() {
    const { builder } = this.props
    const { item, opened } = this.state

    return (
      <li className="list-group-item p-0">
        <div className="d-flex">
          <div style={{width: 40}}>
            <Button variant="light" size="sm" onClick={this.toggle}>
              { opened ? '↘' : '↗'}
            </Button>
          </div>
          <div className="flex-fill">
            {builder({ item, onItemUpdate: this.onItemUpdate })}
            <div className={classnames({'d-none': !opened})}>
              <Leaves
                items={item.childs as Item[]}
                builder={builder}
              />
            </div>
          </div> 
        </div>
      </li>)
  }

  private toggle() {
    this.setState({
      opened: !this.state.opened
    })
  }

  private onItemUpdate(item: Item) {
    this.setState({
      item,
      opened: true
    })
  }
}

export default TreeLeafComponent