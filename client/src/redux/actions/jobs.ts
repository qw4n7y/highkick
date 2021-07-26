import ReduxState from '../state'
import Job from '../../models/job'
import Filters from '../../models/filters'

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

function index(filters: Filters, params: { page: number }) {
  return async (dispatch: any, getState: () => ReduxState) => {
    const jobs = await Jobs.loadRoots(filters, params)
    dispatch(new Index(jobs))
  }
}

function loadActiveRoots(filters: Filters) {
  return async (dispatch: any, getState: () => ReduxState) => {
    const roots = await Jobs.loadActiveRoots(filters)
    return roots
  }
}

function loadSubtree(job: Job) {
  return async (dispatch: any, getState: () => ReduxState) => {
    let updatedJob = await Jobs.loadSubtree(job)
    dispatch(new Update(updatedJob)) // dispatch redux
    return updatedJob // and return value at same moment
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

export default { index, loadSubtree, destroy, getInput, run, loadActiveRoots }