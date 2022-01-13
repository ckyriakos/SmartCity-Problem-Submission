const mongoose = require('mongoose')
const Issue = require('./issue')

const streetSchema = new mongoose.Schema({
  addressName: {
    type: String,
    required: true
  },
  addressNum: {
    type: String,
    required: true,
  },
   postal: {
    type: Number,
    required: true,
  },
  maps:{
    type: String,
    required: false,
  },
   /*amka: {
    type: String,
    required: true,
  },
   birthDate: {
    type: Date,
    required: true,
  },*/
 numOfclaims: {
    type: Number,
    required:false,
  },
})

//preventing patient deletion if he has assigned issues
streetSchema.pre('remove', function(next) {
  Issue.find({ street: this.id }, (err, issues) => {
    
    if (err) {
      next(err)
    } else if (issues.length > 0) {
      next(new Error('This street has issues still'))
    } else {
      next()
    }
  })
})
module.exports = mongoose.model('Street', streetSchema)