import Job from '../models/job'

import API from './api'
import HTTP from '../lib/http'

import Tree from './tree'

async function loadRoots() {
  const rootJsons = await HTTP.get(API.URLS.jobRoots.index)
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

export default { loadRoots, updateJob, retry }
