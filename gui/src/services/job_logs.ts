import Job from '../models/job'
import JobLog from '../models/job_log'

import API from './api'
import HTTP from '../lib/http'

async function loadLogs(job: Job) {
  const data = await HTTP.get(API.URLS.jobLogs.index(job.id))
  const roots = data.map(JobLog.deserialize).reverse()
  return roots
}

export default { loadLogs }
