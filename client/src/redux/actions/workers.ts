import ReduxState from '../state'

import Workers from '../../services/workers'
import Worker from "../../models/worker";

// Action creators

function index() {
	return async (dispatch: any, getState: () => ReduxState) => {
		const items = await Workers.index()
		return items
	}
}

function show(id: number) {
	return async (dispatch: any, getState: () => ReduxState) => {
		const item = await Workers.show(id)
		return item
	}
}

function update(item: Worker) {
	return async (dispatch: any, getState: () => ReduxState) => {
		await Workers.update(item)
	}
}

function destroy(item: Worker) {
	return async (dispatch: any, getState: () => ReduxState) => {
		await Workers.destroy(item)
	}
}

export default { index, destroy, update, show }