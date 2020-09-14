const {protocol, hostname} = window.location

const env = process.env.NODE_ENV

const BASE = {
  'development': `${protocol}//${hostname}:8000`,
  'production': window.location.origin,
  'test': window.location.origin
}[env]

const API_BASE = `${BASE}/highkick`

const URLS = {
  ws: `ws${window.location.protocol === 'https:' ? 's' : ''}://${API_BASE.split("//")[1]}/ws`,
  jobs: {
    job: (id: number) => `${API_BASE}/jobs/show/${id}`,
    retry: (id: number) => `${API_BASE}/jobs/retry/${id}`,
    retryFailedLeaves: (id: number) => `${API_BASE}/jobs/retry_failed_leaves/${id}`,
    subtree: (id: number) => `${API_BASE}/jobs/subtree/${id}`,
    input: (id: number) => `${API_BASE}/jobs/input/${id}`,
    run: `${API_BASE}/jobs/run`,
    destroy: (id: number) => `${API_BASE}/jobs/delete/${id}`,
  },
  jobRoots: {
    index: `${API_BASE}/job_roots/index`
  },
  jobLogs: {
    index: (jobId: number) => `${API_BASE}/job_logs/index/${jobId}`,
  },
  jobMetas: {
    index: `${API_BASE}/job_metas/index`,
  }
}

export default { URLS }