const mongoose = require('mongoose')
const Ehr = require('./ehr')

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

//preventing patient deletion if he has assigned ehrs
authorSchema.pre('remove', function(next) {
  Ehr.find({ author: this.id }, (err, ehrs) => {
    if (err) {
      next(err)
    } else if (ehrs.length > 0) {
      next(new Error('This patient has ehrs still'))
    } else {
      next()
    }
  })
})
module.exports = mongoose.model('Author', authorSchema)