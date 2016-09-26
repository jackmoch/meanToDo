'use strict';

const { json } = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/todo'
const PORT = process.env.PORT || 3000
const app = express()

app.set('port', PORT)

app.use(express.static('client'))
app.use(json())

app.get('/api/title', (req, res) => {
	res.json({ title: 'To Do App'})
})

const Item = mongoose.model('item', {
	content: String,
	date: String,
})

app.get('/api/items', (req, res, err) => 
	Item
		.find({})
		.then(messages => 
		res.json({ messages })
		)
		.catch(err)
)

app.post('/api/items', (req, res, err) => {
	const item = req.body
	Item
		.create(item)
		.then(item => res.json(item))
		.catch(err)
})

app.delete('/api/items/:id', (req, res, err) => {
	const id = req.params.id
	Item
		.remove({_id: id})
		.then(data => res.json(data))
		.catch(err)
})

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () => {
		app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
	})
