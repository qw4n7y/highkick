import React from 'react'
import { Switch, Route } from 'react-router'

import Index from './pages/index'
import Online from './pages/online'
import New from './pages/new'
import SchedulersIndex from './pages/schedulers_index'
import SchedulersNew from './pages/schedulers_new'
import SchedulersEdit from './pages/schedulers_edit'

function Router() {
  return (
    <Switch>
      <Route path="/index" exact component={Index}/>
      <Route path="/online" exact component={Online}/>
      <Route path="/new" exact component={New}/>
      <Route path="/schedulers/index" exact component={SchedulersIndex}/>
      <Route path="/schedulers/new" exact component={SchedulersNew}/>
      <Route path="/schedulers/edit/:id" exact component={SchedulersEdit}/>
      <Route component={Index}/>
    </Switch>
  )
}

export default Router