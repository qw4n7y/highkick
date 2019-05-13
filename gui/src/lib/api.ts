const {protocol, hostname} = window.location

const API_BASE = `${protocol}//${hostname}:8000/highkick`

const URLS = {
  roots: `${API_BASE}/roots`,
  root: (id: any) => `${API_BASE}/roots/${id}`
}

export default { URLS }