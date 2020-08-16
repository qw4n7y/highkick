import * as Redux from 'redux'
import ReduxThunk from 'redux-thunk'

import createRootReducer from './reducers'

import actionToPlainObjectMiddleware from './plain_object_middleware'

declare var window: {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any,
  __USE_MEMORY_HISTORY__?: boolean
}

let composeEnhancers = Redux.compose

// FIXME: https://github.com/zalmoxisus/redux-devtools-extension/issues/588
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
}

// Build the middleware for intercepting and dispatching navigation actions
const middlewares = Redux.applyMiddleware(
  ReduxThunk,
  actionToPlainObjectMiddleware
)
const enhancers = composeEnhancers(middlewares)

function createStore(preloadedState: any = {}) {
  const rootReducer = createRootReducer()
  const store = Redux.createStore(rootReducer, preloadedState, enhancers)
  return store
}

const store = createStore()
export { store, createStore }