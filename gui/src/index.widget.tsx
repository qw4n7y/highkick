import React from 'react'
import ReactDOM from 'react-dom'

import Widget from './widget'
import WS from './services/ws'

import { Provider } from 'react-redux'
import { store } from './redux/store'

WS.handle()

ReactDOM.render(
  <Provider store={store}>
    <Widget />
  </Provider>,
  document.getElementById('highkick-widget'));
