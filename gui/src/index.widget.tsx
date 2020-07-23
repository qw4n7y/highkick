import React from 'react'
import ReactDOM from 'react-dom'

import Widget from './widget'
import WS from './services/ws'

import { Provider } from 'react-redux'
import { store } from './redux/store'

import EventEmitter from './services/event_emitter'
(window as any).highkickEventEmitter = EventEmitter

WS.handle()

var rootEl = document.getElementById('highkick-widget');
if (rootEl !== null) {
  ReactDOM.render(
    <Provider store={store}>
      <Widget />
    </Provider>, rootEl);
}
