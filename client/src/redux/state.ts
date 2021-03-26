import { RouterState as router } from 'connected-react-router'

import { State as app } from './reducers/app'
import { State as jobs } from './reducers/jobs'
import { State as jobMetas } from './reducers/job_metas'

type ReduxState = {
  router: router
  jobs: jobs
  jobMetas: jobMetas
  app: app
}

export default ReduxState