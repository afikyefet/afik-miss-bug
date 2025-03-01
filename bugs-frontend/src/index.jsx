import React from 'react'
import './assets/style/main.css'
import { Provider } from 'react-redux'
import { store } from './store/store'
import ReactDOM from 'react-dom/client'
import { App } from './RootCmp'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)
