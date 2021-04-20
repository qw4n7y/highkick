import ReduxState from '../state'

import Schedulers from '../../services/schedulers'
import Scheduler from "../../models/scheduler";

// Action creators

function index() {
	return async (dispatch: any, getState: () => ReduxState) => {
		const schedulers = await Schedulers.index()
		return schedulers
	}
}

function create(scheduler: Scheduler) {
	return async (dispatch: any, getState: () => ReduxState) => {
		await Schedulers.create(scheduler)
	}
}

function update(scheduler: Scheduler) {
	return async (dispatch: any, getState: () => ReduxState) => {
		await Schedulers.update(scheduler)
	}
}

function show(id: number) {
	return async (dispatch: any, getState: () => ReduxState) => {
		const scheduler = await Schedulers.show(id)
		return scheduler
	}
}

function destroy(scheduler: Scheduler) {
	return async (dispatch: any, getState: () => ReduxState) => {
		await Schedulers.destroy(scheduler)
	}
}

export default { index, create, destroy, update, show }