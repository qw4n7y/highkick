import React from 'react'

type Props<Item> = {
  item: Item
  childs: Item[]
  builder: (item: Item) => React.ReactElement
}

class TreeLeaf<Item> extends React.Component<Props<Item>> {
  render() {
    const { item, childs, builder } = this.props

    return (
      <div>
        {builder(item)}
        <ul>
          { childs.map(child => {
            return (
              <li>{builder(child)}</li>)
          }) }
        </ul>
      </div>)
  }
}

export default TreeLeaf