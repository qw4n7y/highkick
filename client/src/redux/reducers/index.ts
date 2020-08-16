import { combineReducers } from 'redux'

import jobs from './jobs'

const rootReducer = () => combineReducers({
  jobs,
})

export default rootReducer