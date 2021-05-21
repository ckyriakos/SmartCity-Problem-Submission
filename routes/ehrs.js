const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Ehr = require('../models/ehr')
//const multer = require("multer")
//const path = require('path')
//const uploadPath = path.join('public',Ehr.fileBasePath)
//const fs = require('fs')
// filetype filter for multer
const MimeTypes = ['image/jpg','image/jpeg','image/png','image/gif','application/pdf']

/*
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null,MimeTypes.includes(file.mimetype))
  }
})*/
// All Ehrs Route
router.get('/', async (req, res) => {
  let query = Ehr.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  try {
    const ehrs = await query.exec()
    res.render('ehrs/index', {
      ehrs: ehrs,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Ehr Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Ehr())
})

// Create Ehr Route
router.post('/', /*upload.single('fileup'),*/ async (req, res) => {
  //const fileName = req.file != null ? req.file.filename : null //see if file exits and get name
  const ehr = new Ehr({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    //file: fileName
  })
  saveFile(ehr, req.body.fileup)
  try {
    const newEhr = await ehr.save()
    console.log(req.body)
    console.log(req.file)
    res.redirect('/ehrs')
  } catch {
    /*if(ehr.file != null) {
      removefile(ehr.file)
    }*/ //commented since no longer using multer
     renderNewPage(res, ehr, true)
  }
})

// in case it fails to save book we delete this img
/*function removefile(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}*/
async function renderNewPage(res, ehr, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      ehr: ehr
    }
    if (hasError) params.errorMessage = 'Error Creating ehr'
    res.render('ehrs/new', params)
  } catch {
    res.redirect('/ehrs')
  }
}

// function that saves the file to the db, instead of using multer
function saveFile(ehr, fileEncoded) {
  if (fileEncoded == null) return
  const file = JSON.parse(fileEncoded)
  if (file != null && MimeTypes.includes(file.type)) {
    ehr.file = new Buffer.from(file.data, 'base64')
    ehr.fileType = file.type
  }
}
module.exports = router