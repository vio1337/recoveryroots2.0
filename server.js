require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const HTTPError = require('./util/HTTPError')

const db = require('./db/models')
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('./config/passport')
const authenticate = passport.authenticate('jwt', { session: false })

const app = express()
const PORT = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(passport.initialize())

db.sequelize.sync()
.then(()=> {
	app.listen(PORT, ()=> {
		console.log(`Listening on port:${PORT}`)
	})
})


const asyncMiddleware = fn => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next) }


//----------->
// API Routes
//----------->

app.get('/api', (req, res)=> {
	res.send('Welcome to the rr2 API')
})

app.get('/api/users', authenticate, asyncMiddleware(async (req, res)=> {
	let r = await db.User.findAll()
	res.json(r)
}))

app.get('/api/blogs', asyncMiddleware(async (req, res)=> {
	let r = await db.Blog.findAll()
	res.json(r)
}))

app.get('/api/blogs/:id', asyncMiddleware(async (req, res)=> {
	let r = await db.Blog.findAll({where: {id: req.params.id}})
	res.json(r)
}))

app.get('/api/users/:id', asyncMiddleware(async (req, res)=> {
	let r = await db.User.findAll({where: {id: req.params.id}})
	res.json(r)
}))

app.post('/api/blogs/create', (req, res)=> {
	console.log(req.body)
	db.Blog.create({
		title: req.body.title,
		body: req.body.body,
		description: req.body.description,
		uri: req.body.uri,
		category: req.body.category,
		headerImg: req.body.headerImg,
		render: req.body.render,
		userId: req.body.userId,
	}).then(()=> {
		res.redirect({'success':'yay it worked'})
	}).catch(err=> {
		console.log(err)
		res.json(err)
	})
})

app.delete('/api/blogs/delete/:id', ()=> {

})


app.post('/api/signup', (req, res)=> {
	console.log(req.body)
	db.User.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
	}).then(()=> {
		res.redirect('/')
	}).catch(err=> {
		console.log(err)
		res.json(err)
	})
})

app.post("/api/login", asyncMiddleware(async function(req, res, next) {
	console.log(req.body)
	
	const { user, info } = await passportAuthenticateAsync('local', req, res, next)
	
	if (!user) {
		console.log('ERROR~>')
        throw new HTTPError(403, 'Username or password is invalid')
	} 

    const { token } = await reqLoginAsync(req, user)
    return res.status(200).json({ token, user })
}))

function passportAuthenticateAsync(strategy, req, res, next) {
    return new Promise((resolve, reject) => {
        passport.authenticate(strategy, {session: false}, (err, user, info) => {
            if (err) return reject(err)
            return resolve({ user, info })
        })(req, res, next)
    })
}

function reqLoginAsync(req, user) {
    return new Promise((resolve, reject) => {
        req.login(user, {session: false}, err => {
            if (err) return reject(err)
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET)

            return resolve({ token })
        })
    })
}

app.get("/checktoken", authenticate, async (req, res) => {
	res.json(req.user)
})


// error handler
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(err)
    }

    if (err.statusCode) {
        res.status(err.statusCode).json({ error: err.message })
    } else {
        res.status(500).json({ error: `Unhandled error: ${err.toString()}` })
    }
})

