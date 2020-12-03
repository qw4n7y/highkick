import { RouterState as router } from 'connected-react-router'

import { State as jobs } from './reducers/jobs'
import { State as jobMetas } from './reducers/job_metas'

type ReduxState = {
  router: router
  jobs: jobs
  jobMetas: jobMetas
}

export default ReduxState