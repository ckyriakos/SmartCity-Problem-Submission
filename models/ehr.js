const mongoose = require('mongoose')


//const fileBasePath =  'uploads/ehrFiles'

const ehrSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Patient'
  },
  description: {
    type: String,
    required:false,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  fileType: {
    type: String,
    required: true
  },
  file: {
    type: Buffer,
    required:false,
  }
})

ehrSchema.virtual('filePath').get(function() {
  if (this.file != null && this.fileType != null) {
    return `data:${this.fileType};charset=utf-8;base64,${this.file.toString('base64')}`
  }
})


module.exports = mongoose.model('Ehr', ehrSchema)

