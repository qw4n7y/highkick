const {protocol, hostname} = window.location

const API_BASE = `${protocol}//${hostname}:8000/highkick`

const URLS = {
  jobs: {
    job: (id: number) => `${API_BASE}/jobs/${id}`,
    retry: (id: number) => `${API_BASE}/jobs/${id}/retry`,
    subtree: (id: number) => `${API_BASE}/jobs/${id}/subtree`
  },
  jobRoots: {
    index: `${API_BASE}/job_roots`
  },
  jobLogs: {
    index: (jobId: number) => `${API_BASE}/jobs/${jobId}/logs`,
  }
}

export default { URLS }