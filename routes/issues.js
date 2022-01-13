//ROUTING FOR EHR CRUD OPERATIONS
// Ignore the commented code, it's for the use of multer instead of filepond. IN this case some changes should be made to the rest of the code.

const express = require('express')
const router = express.Router()
const Street = require('../models/street')
const Issue = require('../models/issue')
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
  let query = Issue.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  try {
    const issues = await query.exec()
    res.render('issues/index', {
      issues: issues,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Ehr Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Issue())
})

// Create Ehr Route
router.post('/', /*upload.single('fileup'),*/ async (req, res) => {
  //const fileName = req.file != null ? req.file.filename : null //see if file exits and get name
  const issue = new Issue({
    title: req.body.title,
    street: req.body.street,
    description: req.body.description
    //file: fileName
  })
  
  saveFile(issue, req.body.fileup)
  try {
    const newIssue = await issue.save()
    res.redirect(`issues/${newIssue.id}`)

  } catch {
      renderNewPage(res, issue, true)

  }
})


async function renderNewPage(res, issue, hasError = false) {
  try {
    const streets = await Street.find({})
    const params = {
      streets: streets,
      issue: issue
    }
    if (hasError) params.errorMessage = 'Error Creating issue'
    res.render('issues/new', params)
  } catch {
    res.redirect('/issues')
  }
}



// show  ehr route
router.get('/:id',async(req,res) => {
  try {
    const issue = await Issue.findById(req.params.id)
                                  .populate('street')
                                  .exec()
     res.render('issues/show', {issue: issue})                             
  } catch {
      res.redirect('/')
  }
})

// edit  ehr route
router.get('/:id/edit',async(req,res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    renderEditPage(res, issue)
  } catch {
    res.redirect('/')
  }
})

// Update ehr Route
router.put('/:id', async (req, res) => {
  let issue

  try {
    issue = await Issue.findById(req.params.id)
    issue.title = req.body.title
    issue.street = req.body.street
    issue.description = req.body.description
    if (req.body.fileup != null && req.body.fileup !== '') {
      saveFile(issue, req.body.fileup)
    }
    await issue.save()
    res.redirect(`/issues/${issue.id}`)
  } catch {
    if (issue != null) {
      renderEditPage(res, issue, true)
    } else {
      redirect('/')
    }
  }
})

// Delete ehr Page
router.delete('/:id', async (req, res) => {
  let issue
  try {
    issue = await Issue.findById(req.params.id)
    await issue.remove()
    res.redirect('/issues')
  } catch {
    if (issue != null) {
      res.render('issues/show', {
        issue: issue,
        errorMessage: 'Could not remove issue'
      })
    } else {
      res.redirect('/')
    }
  }
})

//checking for errors in the asynchronous functions for rendering
async function renderEditPage(res, issue, hasError = false) {
  renderFormPage(res, issue, 'edit', hasError)
}
async function renderNewPage(res, issue, hasError = false) {
  renderFormPage(res, issue, 'new', hasError)
}

async function renderFormPage(res, issue, form, hasError = false) {
  try {
    const streets = await Street.find({})
    const params = {
      streets: streets,
      issue: issue
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Issue'
      } else {
        params.errorMessage = 'Error Creating Issue'
      }
    }
    res.render(`issues/${form}`, params)
  } catch {
    res.redirect('/issues')
  }
}
// function that saves the file to the db, instead of using multer

function saveFile(issue, fileEncoded) {
if(fileEncoded == null || fileEncoded.length < 1) return
  const file = JSON.parse(fileEncoded)
  if (file != null && MimeTypes.includes(file.type)) {
    issue.file = new Buffer.from(file.data, 'base64')
    issue.fileType = file.type
  }
}
module.exports = router