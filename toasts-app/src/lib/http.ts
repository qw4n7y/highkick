import Axios, { AxiosResponse } from "axios"
import _ from "lodash"

import * as Redux from "redux"
import ToastActions from "../redux/toasts/actions"
import { ToastType } from "../models/toast"

type HTTP_METHOD = "get" | "post" | "put" | "delete"

const DEFAULT_HEADERS = {
  "Accept": "application/json",
  "Content-Type": "application/json"
}

type Options = Partial<{
  onUploadProgress: (percentCompleted: number) => any
}>

async function makeRequest(method: HTTP_METHOD, url: string, data: any = null, options?: Options) {
  const headers = Object.assign({}, DEFAULT_HEADERS)
  let dataToSend = Object.assign({}, data)

  // File uploading
  //
  const flattenedValues = _.flatten((<any>Object).values(dataToSend))
  const hasFiles = flattenedValues.some((v: any) => v instanceof File)
  if (hasFiles) {
    headers["Content-Type"] = "multipart/form-data"
    const _data = new FormData()
    for (const key of Object.keys(dataToSend)) {
      const value = dataToSend[key]
      if (Array.isArray(value)) {
        for (const valueItem of value) {
          _data.append(`${key}[]`, valueItem)
        }
      } else {
        _data.append(key, value)
      }
    }
    dataToSend = _data
  }

  let response: AxiosResponse<unknown, any> | undefined = undefined
  try {
    response = await Axios.request({
      method,
      url,
      data: dataToSend,
      headers: headers,
      withCredentials: false,
      responseType: "json",
      params: method === "get" ? dataToSend : undefined,
      onUploadProgress:
        options && options.onUploadProgress
          ? function (progressEvent) {
              var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              options!.onUploadProgress!(percentCompleted)
            }
          : undefined
    })
  } catch (error: any) {
    const store = (window as any).HIGHKICK_TOASTS_APP_REDUX_STORE as Redux.Store

    const errContent =
      "message" in (error.response?.data || {})
        ? `<p>${error.response?.data?.message}</p>`
        : `<p>${error.response?.request?.responseURL}</p><p>${JSON.stringify(error.response?.data, null, 2)}</p>`

    const action = ToastActions.addToast({
      type: ToastType.Notice,
      title: `${response?.status} ${response?.statusText}`,
      content: errContent
    })
    store.dispatch(action as any)
    throw error
  }

  return response!.data
}

async function get(url: string, data: any = {}, options?: Options) {
  return makeRequest("get", url, data, options)
}

async function post(url: string, data: any = null, options?: Options) {
  return makeRequest("post", url, data, options)
}

async function put(url: string, data: any = null, options?: Options) {
  return makeRequest("put", url, data, options)
}

async function del(url: string, data: any = null, options?: Options) {
  return makeRequest("delete", url, data, options)
}

export default { get, post, put, del }
