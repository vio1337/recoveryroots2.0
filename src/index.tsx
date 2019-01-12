import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import history from './history'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers/rootReducer'
import { setUser } from './actions/userAction'
import { getUsers, checkToken } from './fetch'

const store = createStore(
	rootReducer,
	(window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()	
)


checkToken()
.then(user => {	
	if (user) {
		store.dispatch(setUser(user))
		history.push('/admin')
	}
})

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root')
)
serviceWorker.unregister()
