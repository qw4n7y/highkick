import React from 'react'
import { Switch, Route } from 'react-router'

import Index from './pages/index'
import New from './pages/new'

function Router() {
  return (
    <Switch>
      <Route path="/index" exact component={Index}/>
      <Route path="/new" exact component={New}/>
      <Route component={Index}/>
    </Switch>
  )
}

export default Router