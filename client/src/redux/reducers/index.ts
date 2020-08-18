import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import jobs from './jobs'
import jobMetas from './job_metas'

const rootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  jobs,
  jobMetas,
})

export default rootReducer