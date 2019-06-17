const {protocol, hostname} = window.location

const env = process.env.NODE_ENV

const BASE = {
  'development': `${protocol}//${hostname}:8000`,
  'production': window.location.origin,
  'test': window.location.origin
}[env]

const API_BASE = `${BASE}/highkick`

const URLS = {
  ws: `ws${env === 'production' ? 's' : ''}://${API_BASE.split("//")[1]}/ws`,
  jobs: {
    job: (id: number) => `${API_BASE}/jobs/${id}`,
    retry: (id: number) => `${API_BASE}/jobs/${id}/retry`,
    retryFailedChildren: (id: number) => `${API_BASE}/jobs/${id}/retry_failed_children`,
    subtree: (id: number) => `${API_BASE}/jobs/${id}/subtree`,
  },
  jobRoots: {
    index: `${API_BASE}/job_roots`
  },
  jobLogs: {
    index: (jobId: number) => `${API_BASE}/jobs/${jobId}/logs`,
  }
}

export default { URLS }