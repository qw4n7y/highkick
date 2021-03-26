import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import app from './app'
import jobs from './jobs'
import jobMetas from './job_metas'

const rootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  app,
  jobs,
  jobMetas,
})

export default rootReducer