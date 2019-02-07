import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getBlog, patchBlog } from '../../../fetch'
import { updateBlog } from '../../../redux/actions/blogAction'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Switch from '@material-ui/core/Switch'

interface Props {
	classes: any,
	open:boolean,
	blog:any,
	handleEditDialog:any,
	userId:number,
	updateBlog:Function
}
interface State {
	title:string, 
    body:string, 
    headerImg:string, 
    uri:string, 
    category:string, 
    description:string, 
    render:boolean,    
}

class EditBlog extends Component<Props, State> {

	constructor(props: Props) {
		super(props)
		
		this.state = {
			title: '',
			body: '',
			headerImg: '',
			description: '',
			render: false,
			category: '',
			uri: ''
		}
	}


	componentDidUpdate(prevProps:any, prevState:any) {
		if (prevProps.blog !== this.props.blog) {

			const blog = this.props.blog[0]
			this.setState({
				title: blog.title,
				body: blog.body,
				headerImg: blog.headerImg,
				description: blog.description,
				render: blog.render,
				category: blog.category,
				uri: blog.uri
			})
		}
	}
	
	handleClose = async () => {
		this.setState({
			title: '',
			body: '',
			headerImg: '',
			description: '',
			render: false,
			category: '',
			uri: '',
		}, () => {
			this.props.handleEditDialog()
		})
	}

	handleSubmit = async (event:any) => {
		event.preventDefault()
		const { title, body, headerImg, uri,
			category, description, render } = this.state
		const id = this.props.blog[0].id
		try {
			let b = await patchBlog(id, title, body, headerImg,
			uri, category, description, render)
			console.log(b[0])
			this.props.updateBlog(b)
			this.props.handleEditDialog()
		} catch(err) {
			console.log(err.toString())
		}
	}

	render() {
		const {classes, open, blog} = this.props
		const { title, body, headerImg, uri, category, description, render } = this.state

		if (blog[0]) {
			return (
				<Dialog open={open} fullScreen>
					<AppBar position='static' className={classes.appbar}>
						<Toolbar>
							<IconButton onClick={this.handleClose}>
								<CloseIcon/>
							</IconButton>
							<div style={{marginRight: 10}}>
								Edit Blog
								<span className={classes.appBlogTitle}>
									{blog[0].title}
								</span>
							</div>
						</Toolbar>
					</AppBar>

					<form onSubmit={this.handleSubmit} className={classes.form}>
						<TextField
							className={classes.textField}
							variant='outlined'
							label='Title'
							onChange={evt => this.setState({title: evt.target.value}, ()=> console.log(this.state.title))}
							value={title}
						/>
						<TextField
							className={classes.textField}
							variant='outlined'
							multiline
							rows={6}
							label='Body'
							onChange={evt => this.setState({body: evt.target.value})}
							value={body}
						/>
						<TextField
							className={classes.textField}
							variant='outlined'
							multiline
							rows={3}
							inputProps={{maxLength:120}}
							label='Description'
							onChange={evt => this.setState({description: evt.target.value})}
							value={description}
						/>
						<TextField
							className={classes.textField}
							variant='outlined'
							label='Blog URL Path'
							onChange={evt => this.setState({uri: evt.target.value})}
							value={uri}
						/>
						<div className={classes.toggleSection}>
							<div>Draft</div>
							<Switch
								color='primary'
								checked={this.state.render}
								onChange={evt => this.setState({render: !this.state.render }, ()=> console.log(this.state.render))}
								value={render}
							/>
							<div>Publish</div>
						</div>
						<TextField
							className={classes.textField}
							variant='outlined'
							label='Main Image'
							onChange={evt => this.setState({headerImg: evt.target.value})}
							value={headerImg}
						/>
						<DialogActions style={{justifyContent:'flex-start'}}>
							<Button variant='contained' style={{backgroundColor: '#e5c85c'}} type='submit'>
								<SaveIcon style={{marginRight: 5}}/>
								Save
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			)
		} else return null
	}
}

const styles = createStyles({
	appbar: {
		color: 'black',
		fontFamily: 'Roboto',
		backgroundColor: '#CBDFCF',
		fontSize: '1.5em',
		fontWeight: 'bold',
		display: 'flex',
		justifyContent: 'center',
	},
	appBlogTitle: {
		fontWeight: 'normal',
		fontSize: '.8em',
		color: 'rgba(0,0,0,.4)',
		marginLeft: 10,
	},
	form: {
		margin: 40,
		display: 'flex',
		flexFlow: 'column nowrap',
	},
	textField: {
		margin: '10px 0',
	},
	toggleSection: {
		display: 'flex',
		alignItems: 'center',
		fontFamily: 'Roboto',
	},
})

const mapStateToProps = (state:any) => ({userId: state.user.user.id})
const mapDispatchToProps = { updateBlog }
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditBlog))