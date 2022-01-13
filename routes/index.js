// Routing for index
const express = require('express')
const router = express.Router()
const Issue = require('../models/issue')

router.get('/', async (req, res) => {
  let issues
  try {
    issues = await Issue.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    issues = []
  }
  res.render('index', { issues: issues })
})

module.exports = router