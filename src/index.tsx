import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import history from './history'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './redux/reducers/rootReducer'
import { setUser } from './redux/actions/userAction'
import { setBlog } from './redux/actions/blogAction'
import { getUsers, checkToken, getUserBlogs } from './fetch'

const store = createStore(
	rootReducer,
	(window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()	
)


checkToken()
.then(user => {	
	if (user) {
		store.dispatch(setUser(user))
		return user
	}
})
.then(user=> getUserBlogs(user.id))
.catch(err=> console.log(err))
.then(blogs=> {
	if (blogs) {
		blogs.forEach((blog:any)=> store.dispatch(setBlog(blog)))
	}
})

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>, 
	document.getElementById('root')
)
serviceWorker.unregister()
