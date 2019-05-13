import Axios from 'axios'

type HTTP_METHOD = 'get' | 'post' | 'put' | 'delete'

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

async function makeRequest(method: HTTP_METHOD, url: string, data: any = null) {
  const headers = Object.assign({}, DEFAULT_HEADERS)
  let dataToSend = Object.assign({}, data)

  // File uploading
  //
  const hasFiles = ((<any>Object).values(dataToSend).some((v: any) => v instanceof File))
  if (hasFiles) {
    headers['Content-Type'] = 'multipart/form-data'
    const _data = new FormData()
    for (const key of Object.keys(dataToSend)) {
      _data.append(key, dataToSend[key])
    }
    dataToSend = _data
  }

  let response 
  try {
    response = await Axios.request({
      method, url, 
      data: dataToSend,
      headers: headers,
      // withCredentials: true,
      responseType: 'json',
      params: (method === 'get') ? dataToSend : undefined
    })
  } catch (error) {
    if (!error.response) {
      throw error
    }
    
    if (error.response.status === 422) {
      const e: any = new Error('422 response')
       // NOTE: Client-server integration convention
      e.__SERVER_SIDE_ERRORS__ = error.response.data.errors
      throw e
    }

    throw error
  }
  
  return response.data
}

async function get(url: string, data: any = {}) {
  return makeRequest('get', url, data)
}

async function post(url: string, data: any = null) {
  return makeRequest('post', url, data)
}

async function put(url: string, data: any = null) {
  return makeRequest('put', url, data)
}

async function del(url: string, data: any = null) {
  return makeRequest('delete', url, data)
}

export default { get, post, put, del }
