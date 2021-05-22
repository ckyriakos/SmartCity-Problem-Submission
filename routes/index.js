// Routing for index
const express = require('express')
const router = express.Router()
const Ehr = require('../models/ehr')

router.get('/', async (req, res) => {
  let ehrs
  try {
    ehrs = await Ehr.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    ehrs = []
  }
  res.render('index', { ehrs: ehrs })
})

module.exports = router