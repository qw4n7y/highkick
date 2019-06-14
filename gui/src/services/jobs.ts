import Job, { Status } from '../models/job'

import API from './api'
import HTTP from '../lib/http'

import Tree from './tree'

async function loadRoots(params: { page: number }) {
  const rootJsons = await HTTP.get(API.URLS.jobRoots.index, params)
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

async function retryFailedChildren(job: Job) {
  await HTTP.post(API.URLS.jobs.retryFailedChildren(job.id))
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

export default { loadRoots, updateJob, retry, retryFailedChildren, destroy, treeStatus }
