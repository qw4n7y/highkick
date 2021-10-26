import JobLog from '../models/job_log'

import API from './api'
import HTTP from '../lib/http'

async function loadLogsByJobId(jobId: number) {
  const data = await HTTP.get(API.URLS.jobLogs.indexByJobId(jobId))
  const roots = data.map(JobLog.deserialize).reverse()
  return roots
}

export type Filters = Partial<{
  Since: string
  Till: string
  IDSince: number
  Limit: number
}>

async function index(filters: Filters) {
  const url = API.URLS.jobLogs.index
  const data = Object.assign({}, { filters })
  const responseJson = await HTTP.get(url, data)
  let items = (responseJson.Items as any[]).map(JobLog.deserialize)
  return items
}

export default { loadLogsByJobId, index }
