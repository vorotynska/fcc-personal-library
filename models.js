const mongoose = require("mongoose")

const {
  Schema,
} = mongoose.Schema

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String]
})

// Sets the createdAt parameter equal to the current time
BookSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('Book', BookSchema)