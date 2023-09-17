const mongoose = require("mongoose")

const {
    Schema, 
} = mongoose

const bookSchema = new mongoose.Schema({
	title: {type: String, required: true},
  comments: [String]
})

let Book = mongoose.model('Book', bookSchema)