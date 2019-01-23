import React, { Component, Fragment as F} from 'react'
import { Router, Route, Link, Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { setUser } from './actions/userAction'
import history from './history'
import Sidebar from './components/admin/Sidebar'
import AdminLogin from './components/admin/AdminLogin'
import AdminPortal from './components/admin/AdminPortal'
import CreateBlog from './components/admin/CreateBlog'
import ViewBlogs from './components/admin/ViewBlogs'

interface Props {email:string}
interface State {}

class App extends Component<Props, State> {	
	
	render() {
		console.log(this.props.email)
		return (
			<Router history={history}>
				<div style={{fontFamily: 'Roboto'}}>
					{this.props.email ? 
						<Sidebar history={history}/>
					:	
						<Redirect to='/admin/login' />
					}
					<Route path='/admin/login' component={AdminLogin} />
				</div>
			</Router>
		)
	}
}

const mapStateToProps = (state:any) => ({email: state.user.user.email})

export default connect(mapStateToProps)(App)
