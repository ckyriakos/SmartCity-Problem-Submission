const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  /*name: {
    type: String,
    required: true
  },*/
  firstName: {
    type: String,
    required: true,
  },
   lastName: {
    type: String,
    required: true,
  },
   amka: {
    type: String,
    required: true,
  },
   birthDate: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model('Author', authorSchema)