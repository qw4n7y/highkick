import API from './api'
import HTTP from '../lib/http'

import Scheduler from '../models/scheduler'

async function index() {
    const data = Object.assign({}, {})
    const url = API.URLS.schedulers.index
    const response = await HTTP.get(url, data)
    const items = (response as any[]).map(props => new Scheduler(props))
    return items
}

async function create(scheduler: Scheduler) {
    const data = Object.assign({}, scheduler)
    const url = API.URLS.schedulers.create
    await HTTP.post(url, data)
}

async function update(scheduler: Scheduler) {
    const data = Object.assign({}, scheduler)
    const url = API.URLS.schedulers.update(scheduler.ID)
    await HTTP.post(url, data)
}

async function show(id: number) {
    const data = Object.assign({}, {})
    const url = API.URLS.schedulers.show(id)
    const response = await HTTP.get(url, data)
    return new Scheduler(response)
}

async function destroy(scheduler: Scheduler) {
    const url = API.URLS.schedulers.destroy(scheduler.ID)
    await HTTP.del(url)
}

export default { index, create, destroy, update, show }