import React from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import * as reducers from '../reducers'
import ValEduApp from './ValEduApp'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const reducer = combineReducers(reducers)
const store = createStoreWithMiddleware(reducer)

export default function App() {
  return (
    <Provider store={store}>
      <ValEduApp />
    </Provider>
  )
}
