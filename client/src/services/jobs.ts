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

async function loadActiveRoots(filters: Filters) {
  const data = Object.assign({}, { filters })
  const url = API.URLS.jobRoots.active
  const responseJson = await HTTP.get(url, data)
  const childrenStats= responseJson.ChildrenStats as {RootID: number, ChildrenStatuses: {[status: string]: number}}[]
  
  let roots = (responseJson.Items as any[]).map(Job.deserialize)
  roots = roots.map(root => {
    root.childrenStatuses = childrenStats.find(cs => cs.RootID === root.id)!.ChildrenStatuses
    return root
  })

  return roots
}

async function loadSubtree(job: Job) {
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
  const url = API.URLS.jobs.destroy(job.id)
  await HTTP.del(url)
}

function treeStatus(job: Job): Status {
  const statuses = job.childs.map(treeStatus)
  statuses.push(job.status)
  if (!!job.treeStatus) { statuses.push(job.treeStatus) }

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

async function runJob(sid: string, input: any) {
  const url = API.URLS.jobs.run
  const response = await HTTP.post(url, {
    SID: sid,
    Input: input,
  })
  return response
}

export default { 
  loadRoots, loadSubtree, retry, retryFailedLeaves,
  destroy, treeStatus, getInput,
  runJob,
  loadActiveRoots,
}
