import { State as jobs } from './reducers/jobs'
import { State as jobMetas } from './reducers/job_metas'

type ReduxState = {
  jobs: jobs
  jobMetas: jobMetas
}

export default ReduxState