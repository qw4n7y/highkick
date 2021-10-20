import React from 'react'
import { Switch, Route } from 'react-router'

import Index from './pages/index'
import Online from './pages/online'
import New from './pages/new'
import JobsEdit from './pages/edit'

import SchedulersIndex from './pages/schedulers_index'
import SchedulersNew from './pages/schedulers_new'
import SchedulersEdit from './pages/schedulers_edit'

import WorkersIndex from './pages/workers/index'
import WorkersEdit from './pages/workers/edit'

function Router() {
  return (
    <Switch>
      <Route path="/index" exact component={Index}/>
      <Route path="/online" exact component={Online}/>
      <Route path="/new" exact component={New}/>
      <Route path="/jobs/edit/:id" exact component={JobsEdit}/>
      <Route path="/schedulers/index" exact component={SchedulersIndex}/>
      <Route path="/schedulers/new" exact component={SchedulersNew}/>
      <Route path="/schedulers/edit/:id" exact component={SchedulersEdit}/>
      <Route path="/workers/index" exact component={WorkersIndex}/>
      <Route path="/workers/edit/:id" exact component={WorkersEdit}/>
      <Route component={Index}/>
    </Switch>
  )
}

export default Router