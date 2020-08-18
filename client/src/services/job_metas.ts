import JobMeta from '../models/job_meta'

import API from './api'
import HTTP from '../lib/http'

async function index() {
  const url = API.URLS.jobMetas.index
  const response = await HTTP.get(url, {})
  const items = (response.items as any[]).map(JobMeta.deserialize)
  return items
}

export default { index }
