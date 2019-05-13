import React from 'react'
import classnames from 'classnames'

import { Row, Col, Button } from 'react-bootstrap'

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
      <Row>
        <Col md={1} className="p-0">
          <Button size="sm" onClick={this.toggle}>
            { opened ? '↘' : '↗'}
          </Button>
        </Col>
        <Col md={11} className="p-0">
          {builder({ item, onItemUpdate: this.onItemUpdate })}
          <div className={classnames({'d-none': !opened})}>
            <Leaves
              items={item.childs as Item[]}
              builder={builder}
            />
          </div>
        </Col> 
      </Row>)
  }

  private toggle() {
    this.setState({
      opened: !this.state.opened
    })
  }

  private onItemUpdate(item: Item) {
    this.setState({ item })
  }
}

export default TreeLeafComponent