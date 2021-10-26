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
  highkick: {
    hello: `${API_BASE}/highkick/hello`,
  },
  jobs: {
    job: (id: number) => `${API_BASE}/jobs/show/${id}`,
    retry: (id: number) => `${API_BASE}/jobs/retry/${id}`,
    retryFailedLeaves: (id: number) => `${API_BASE}/jobs/retry_failed_leaves/${id}`,
    subtree: (id: number) => `${API_BASE}/jobs/subtree/${id}`,
    input: (id: number) => `${API_BASE}/jobs/input/${id}`,
    run: `${API_BASE}/jobs/run`,
    destroy: (id: number) => `${API_BASE}/jobs/delete/${id}`,
    update: (id: number) => `${API_BASE}/jobs/update/${id}`,
    updateInput: (id: number) => `${API_BASE}/jobs/update_input/${id}`,
    show: (id: number) => `${API_BASE}/jobs/show/${id}`,
  },
  jobRoots: {
    index: `${API_BASE}/job_roots/index`,
    active: `${API_BASE}/job_roots/active`
  },
  jobLogs: {
    indexByJobId: (jobId: number) => `${API_BASE}/job_logs/index_by_job_id/${jobId}`,
    index: `${API_BASE}/job_logs/index`,
  },
  jobMetas: {
    index: `${API_BASE}/job_metas/index`,
  },
  schedulers: {
    index: `${API_BASE}/schedulers/index`,
    create: `${API_BASE}/schedulers/create`,
    update: (id: number) => `${API_BASE}/schedulers/update/${id}`,
    destroy: (id: number) => `${API_BASE}/schedulers/destroy/${id}`,
    show: (id: number) => `${API_BASE}/schedulers/show/${id}`,
  },
  workers: {
    index: `${API_BASE}/workers/index`,
    update: (id: number) => `${API_BASE}/workers/update/${id}`,
    destroy: (id: number) => `${API_BASE}/workers/destroy/${id}`,
    show: (id: number) => `${API_BASE}/workers/show/${id}`,
  }
}

export default { URLS }