import express from 'express'
import mongodb from 'mongodb'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
const dbUrl = 'mongodb://localhost:27017/crudwithredux'

mongodb.MongoClient.connect(dbUrl, (err, database) => {
	
	if (err) { throw err }
	const db = database.db('crudwithredux')
	
	app.get('/api/games/:_id', (req, res) => {
		db.collection('games').findOne({ _id: new mongodb.ObjectId(req.params._id)}, (err, game) => {
			if (err) { throw err }
			res.json({ game })
		})
	})

	app.get('/api/games', (req, res) => {
		db.collection('games').find({}).toArray((err, games) => {
			res.json({ games })
		})
	})

	app.post('/api/games', (req, res) => {
		const {isValid, errors} = validate(req.body)

		if(isValid) {
			const { title, cover } = req.body
			db.collection('games').insert({ title, cover }, (err, result) => {
				if(err) { res.status(500).json({ errors: { global: 'Something when wrong' }})}
				else {
					res.json({ game: result.ops[0] })
				}
			})
		}
		else {
			res.status(400).json({ errors })
		}
	})

	app.put('/api/games/:_id', (req, res) => {
		const { errors, isValid } = validate(req.body)

		if(isValid) {
			const { title, cover } = req.body
			db.collection('games').findOneAndUpdate(
				{ _id: new mongodb.ObjectId(req.params._id) },
				{ $set: { title, cover } },
				{ returnOriginal: false },
				(err, result) => {
					if(err) {
						res.status(500).json({ errors : { global: err } })
						return
					}
					res.json({ game: result.value })
				}
			)
		}
		else {
			res.status(400).json({ errors })
		}
	})

	app.delete('/api/games/:_id', (req, res) => {
		db.collection('games').deleteOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, result) => {
			if(err) {
				res.status(500).json({ errors : { global: err } })
				return
			}

			res.json({})
		})
	})

	app.use((req, res) => {
		res.status(404).json({
			errors: {
				global: 'Still working on it. Please, try it again later'
			}
		})
	})

	app.listen(8080, () => {
		console.log('\nRunning server on localhost:8080\n')
	})
})

function validate(data) {
	let errors = {}
		
	if(data.title === '') {
		errors.title = "Can't be blank"
	}
	if(data.cover === '') {
		errors.cover = "Can't be blank"
	}

	const isValid = Object.keys(errors).length === 0

	return { errors, isValid }
}