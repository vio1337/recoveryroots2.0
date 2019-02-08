import React, { Component, Fragment } from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import classnames from 'classnames'
import Home from './Home'
import About from './About'
import Blog from './Blog'
import Contact from './Contact'
import Community from './Community'
import logo from '../../styles/imgs/inverse-transparent-logo.png'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

interface Props {classes: any, history:any}

class NavBar extends Component<Props> {

	render() {
		const {classes, history} = this.props
		const path = history.location.pathname
		return (
			<Fragment>
				<AppBar position="fixed">
					<Toolbar className={classes.appbar}>
						<Link
							to='/about' 
							className={path === '/about' ? classnames(classes.link, classes.path) : classes.link}
						>
							about
						</Link>
						<Link 
							to='/contact'
							className={path === '/contact' ? classnames(classes.link, classes.path) : classes.link}
						>
							contact
						</Link>
						<Link 
							to='/'
							className={path === '/' ? classnames(classes.link, classes.path) : classes.link}
						>
							<img height={25} src={logo}/>
						</Link>
						<Link 
							to='/community'
							className={path === '/community' ? classnames(classes.link, classes.path) : classes.link}
						>
							community
						</Link>
						<Link 
							to='/blog'
							className={path === '/blog' ? classnames(classes.link, classes.path) : classes.link}
						>
							blog
						</Link>
					</Toolbar>
				</AppBar>
				<div className={classes.contentContainer}>
					<Route path='/' exact component={Home} />
					<Route path='/about' exact component={About} />
					<Route path='/blog' component={Blog} />
					<Route path='/community' component={Community} />
					<Route path='/contact' exact component={Contact} />
				</div>
			</Fragment>
		)
	}
}

const styles = createStyles({
	contentContainer: {
		marginTop: 64,
		display: 'flex',
		flexFlow: 'column wrap',
		alignItems: 'center'
	},
	appbar: {
		backgroundColor: 'black',
		justifyContent: 'space-evenly',
		fontSize: '.8em',
	},
	btn: {
		backgroundColor: 'chocolate',
		textTransform: 'lowercase',
	},
	link: {
		textDecoration: 'none',
		color: 'white',
		paddingBottom: 3,
	},
	path: {
		borderBottom: '1px solid white',
	}
})

export default withStyles(styles)(NavBar)