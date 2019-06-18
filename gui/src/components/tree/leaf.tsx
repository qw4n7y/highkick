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

type State = {
  opened: boolean
}

class TreeLeafComponent<Item extends TreeLeaf> extends React.Component<Props<Item>, State> {
  constructor(props: Props<Item>) {
    super(props)

    this.state = {
      opened: props.item.isRoot() ? false : true
    }

    this.toggle = this.toggle.bind(this)
    this.expand = this.expand.bind(this)
  }

  render() {
    const { item, builder } = this.props
    const { opened } = this.state

    return (
      <li className="list-group-item p-0">
        <div className="d-flex">
          <div style={{width: 40}}>
            <Button variant="light" size="sm" onClick={this.toggle}>
              { opened ? '↘' : '↗'}
            </Button>
          </div>
          <div className="flex-fill">
            {builder({ item, expandTreeLeaf: this.expand })}
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

  private expand() {
    this.setState({
      opened: true
    })
  }
}

export default TreeLeafComponent