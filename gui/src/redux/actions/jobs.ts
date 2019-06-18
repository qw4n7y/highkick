import ReduxState from '../state'
import Job from '../../models/job'

import Jobs from '../../services/jobs'

// Types

export const INDEX = 'JOBS/INDEX'
export const UPDATE = 'JOBS/UPDATE'
export const DESTROY = 'JOBS/DESTROY'

// Actions

export class Update {
  type = UPDATE
  constructor(public job: Job) { }
}

export class Index {
  type = INDEX
  constructor(public jobs: Job[]) { }
}

export class Destroy {
  type = DESTROY
  constructor(public job: Job) { }
}

// Action creators

function index(params: { page: number }) {
  return async (dispatch: any, getState: () => ReduxState) => {
    const jobs = await Jobs.loadRoots(params)
    dispatch(new Index(jobs))
  }
}

function update(job: Job) {
  return async (dispatch: any, getState: () => ReduxState) => {
    let updatedJob = await Jobs.updateJob(job)
    dispatch(new Update(updatedJob))
  }
}

function destroy(job: Job) {
  return async (dispatch: any, getState: () => ReduxState) => {
    await Jobs.destroy(job)
    dispatch(new Destroy(job))
  }
}

export default { index, update, destroy }