import React from 'react'

import LeafBuilder from './../tree/builder'

import Job from '../../models/job'
import ItemComponent from './item'

const builder: LeafBuilder<Job> = props => {
  return (
    <ItemComponent
      job={props.item}
      expandTreeLeaf={props.expandTreeLeaf}
    />)
}

export default { builder }