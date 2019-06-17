import ReduxState from '../state'
import Job from '../../models/job'

import Jobs from '../../services/jobs'

// Types

export const INDEX = 'JOBS/INDEX'
export const UPDATE = 'JOBS/UPDATE'

// Actions

export class Update {
  type = UPDATE
  constructor(public job: Job) { }
}

export class Index {
  type = INDEX
  constructor(public jobs: Job[]) { }
}

// Action creators

function index(params: { page: number }) {
  return async (dispatch: any, getState: () => ReduxState) => {
    const jobs = await Jobs.loadRoots(params)
    dispatch(new Index(jobs))
  }
}

export default { index }