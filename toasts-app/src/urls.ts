export function resolveUrl(url: string): string {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:9000" + url
  }
  return url
}

const URLS = {
  highkick: {
    gui: resolveUrl(`/highkick/client/`),
    job: (jobId: number) => resolveUrl(`/highkick/jobs/show/${jobId}`),
    activeJobRoots: resolveUrl(`/highkick/job_roots/active`)
  },
}

export default URLS
