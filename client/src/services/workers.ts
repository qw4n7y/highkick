import API from './api'
import HTTP from '../lib/http'

import Worker from '../models/worker'

async function index() {
    const data = Object.assign({}, {})
    const url = API.URLS.workers.index
    const response = await HTTP.get(url, data)
    const items = (response as any[]).map(props => new Worker(props))
    return items
}

async function show(id: number) {
    const data = Object.assign({}, {})
    const url = API.URLS.workers.show(id)
    const response = await HTTP.get(url, data)
    return new Worker(response)
}

async function update(item: Worker) {
    const data = Object.assign({}, item)
    const url = API.URLS.workers.update(item.ID)
    await HTTP.post(url, data)
}

async function destroy(item: Worker) {
    const url = API.URLS.workers.destroy(item.ID)
    await HTTP.del(url)
}

export default { index, destroy, update, show }