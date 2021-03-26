import ReduxState from '../state'
import Job from '../../models/job'
import Filters from '../../models/filters'

import Jobs from '../../services/jobs'

// Types

export const INDEX = 'JOBS/INDEX'
export const UPDATE = 'JOBS/UPDATE'
export const DESTROY = 'JOBS/DESTROY'
export const CHANGE_VIEWJSONLIKEAPRO = 'CHANGE_VIEWJSONLIKEAPRO'

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

export class CHANGE_viewJSONlikeAPro {
  type = CHANGE_VIEWJSONLIKEAPRO
  constructor(public newValue: boolean) { }
}

// Action creators

function index(filters: Filters, params: { page: number }) {
  return async (dispatch: any, getState: () => ReduxState) => {
    const jobs = await Jobs.loadRoots(filters, params)
    dispatch(new Index(jobs))
  }
}

function loadSubtree(job: Job) {
  return async (dispatch: any, getState: () => ReduxState) => {
    let updatedJob = await Jobs.loadSubtree(job)
    dispatch(new Update(updatedJob))
  }
}

function destroy(job: Job) {
  return async (dispatch: any, getState: () => ReduxState) => {
    await Jobs.destroy(job)
    dispatch(new Destroy(job))
  }
}

function getInput(job: Job) {
  return async (dispatch: any, getState: () => ReduxState) => {
    const input = await Jobs.getInput(job)
    return input
  }
}

function run(sid: string, input: any) {
  return async (dispatch: any, getState: () => ReduxState) => {
    const response = await Jobs.runJob(sid, input)
    return response
  }
}

function changeViewJSONlikeAPro(newValue: boolean) {
  return async (dispatch: any, getState: () => ReduxState) => {
    dispatch(new CHANGE_viewJSONlikeAPro(newValue))
  }
}

export default { index, loadSubtree, destroy, getInput, run, changeViewJSONlikeAPro }