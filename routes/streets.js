// Handles CRUD OPERATIONS ROUTING FOR PATIENS
const express = require('express')
const router = express.Router()
const Street = require('../models/street')
const Issue = require('../models/issue')
// All patients Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.addressName != null && req.query.addressName !== '') {
    searchOptions.addressName = new RegExp(req.query.addressName, 'i') // to search for part of a name
  }
  try {
    const streets = await Street.find(searchOptions) //searchOptions is pretty much for find queries
    //const numof = await Issue.find({ street: street.id })
    res.render('streets/index', {
      streets: streets,
      searchOptions: req.query,
      //numOfclaims: numof.length
    })
  } catch {
    res.redirect('/')
  }
})

// New street Route
router.get('/new', (req, res) => {
  res.render('streets/new', { street: new Street() })
})

// Create street Route
router.post('/', async (req, res) => {
  const street = new Street({
    addressName: req.body.addressName,
    addressNum: req.body.addressNum,
    postal: req.body.postal,
    maps: req.body.maps

  })
  try {
    const newStreet = await street.save()
    res.redirect("streets/${newStreet.id}")
  } catch {
    res.render('streets/new', {
      street: street,
      errorMessage: 'Error creating Street'
    })
  }
})

// show street
router.get('/:id', async (req,res)=> {
   try {
    const street = await Street.findById(req.params.id)
    const issues = await Issue.find({ street: street.id }).limit(6).exec()
    res.render('streets/show', {
      street: street,
      issueForStreet: issues,
      //numOfclaims:issues.length
    })
  } catch {
    res.redirect('/')
  }
})
//  get edit street
router.get('/:id/edit', async (req, res) => {
  try {
    const street = await Street.findById(req.params.id)
    res.render('streets/edit', { street: street })
  } catch {
    res.redirect('/streets')
  }
})

// updates street
router.put('/:id', async (req,res)=> {
  
  let street 
  try {
    street = await Street.findById(req.params.id)

    street.addressName = req.body.addressName,
    street.addressNum = req.body.addressNum,
    street.postal = req.body.postal,
    street.maps = req.body.maps,
    await street.save()

    res.redirect('/streets/${street.id}')
  } catch {
    if(street == null){
      res.redirect('/')
    } else {

      res.render('streets/edit', {
      street: street,
      errorMessage: 'Error updating Strret'
    })

    }
  }
})

// deletes street
router.delete('/:id',async (req,res)=> {
  
  let street 
  try {
    street = await Street.findById(req.params.id)
    
    await  street.remove()
    res.redirect('/streets')

  } catch {
    if(street == null){
      res.redirect('/')
    } else {
        res.redirect('/streets/${street.id}')
    }

    }
  })

module.exports = router