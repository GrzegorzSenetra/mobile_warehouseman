import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/store'

import App from './App';

export default function PlanCreator() {
    return (
        <Provider store={store()}>
            <App />
        </Provider>
    )
}