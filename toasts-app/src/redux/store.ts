import * as Redux from 'redux'
import ReduxThunk from 'redux-thunk'
import * as ReduxStateSync from 'redux-state-sync'

import createRootReducer from './reducer'
import ReduxState from './state'

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

// Redux sync between tabs
const syncBetweenTabsMiddleware = ReduxStateSync.createStateSyncMiddleware({
  whitelist: ['TOASTS/ADD', 'TOASTS/REMOVE', 'TOASTS/UPDATE', 'TOASTS/SNOOZE'],     // Only actions in this list will be triggered in other tabs
  prepareState: (state: ReduxState) => ({ toasts: state.toasts }), // Prepare the initial state for sending to other tabs
})

// Build the middleware for intercepting and dispatching navigation actions
const middlewares = Redux.applyMiddleware(
  ReduxThunk,
  actionToPlainObjectMiddleware,
  syncBetweenTabsMiddleware,
)
const enhancers = composeEnhancers(middlewares)

function createStore(preloadedState: any = {}) {
  let rootReducer = createRootReducer() as any // !!!
  const store = Redux.createStore(ReduxStateSync.withReduxStateSync(rootReducer), preloadedState, enhancers)
  return store
}

const store = createStore()
ReduxStateSync.initStateWithPrevTab(store)

export { store, createStore }