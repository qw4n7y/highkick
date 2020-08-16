import Job, { Status } from '../models/job'
import Filters from '../models/filters'

import API from './api'
import HTTP from '../lib/http'

import Tree from './tree'

async function loadRoots(filters: Filters, params: { page: number }) {
  const data = Object.assign({}, params, { filters })
  const url = API.URLS.jobRoots.index
  const rootJsons = await HTTP.get(url, data)
  const roots = rootJsons.map(Job.deserialize)
  return roots
}

async function updateJob(job: Job) {
  const jsons = await HTTP.get(API.URLS.jobs.subtree(job.id))
  const jobs = jsons.map(Job.deserialize)
  const updatedJob = Tree.compose<Job>({
    items: jobs,
    rootId: job.id
  })
  return updatedJob
}

async function retry(job: Job) {
  await HTTP.post(API.URLS.jobs.retry(job.id))
}

async function retryFailedLeaves(job: Job) {
  await HTTP.post(API.URLS.jobs.retryFailedLeaves(job.id))
}

async function destroy(job: Job) {
  await HTTP.del(API.URLS.jobs.job(job.id))
}

function treeStatus(job: Job): Status {
  const statuses = job.childs.map(treeStatus)
  statuses.push(job.status)

  if (statuses.some(s => s === 'processing')) {
    return 'processing'
  }

  if (statuses.some(s => s === 'failed')) {
    return 'failed'
  }

  if (statuses.every(s => s === 'completed')) {
    return 'completed'
  }

  if (statuses.every(s => s === 'initial')) {
    return 'initial'
  }

  return 'processing'
}

async function getInput(job: Job) {
  const url = API.URLS.jobs.input(job.id)
  const data = await HTTP.get(url)
  return data
}

export default { loadRoots, updateJob, retry, retryFailedLeaves, destroy, treeStatus, getInput }
