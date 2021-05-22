const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Ehr = require('../models/ehr')
// All Authors Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.amka != null && req.query.amka !== '') {
    searchOptions.amka = new RegExp(req.query.amka, 'i') // to search for part of a name
  }
  try {
    const authors = await Author.find(searchOptions) //searchOptions is pretty much for find queries
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
})

// Create Author Route
router.post('/', async (req, res) => {
  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    amka: req.body.amka,
    birthDate: req.body.birthDate
  })
  try {
    const newAuthor = await author.save()
    res.redirect("authors/${newAuthor.id}")
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Patient'
    })
  }
})

// show author
router.get('/:id', async (req,res)=> {
   try {
    const author = await Author.findById(req.params.id)
    const ehrs = await Ehr.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      ehrForPatient: ehrs
    })
  } catch {
    res.redirect('/')
  }
})

//  get edit author
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { author: author })
  } catch {
    res.redirect('/authors')
  }
})

// updates author
router.put('/:id', async (req,res)=> {
  
  let author 
  try {
    author = await Author.findById(req.params.id)

    author.firstName = req.body.firstName
    author.lastName = req.body.lastName
    author.amka = req.body.amka
    author.birthDate = req.body.birthDate

    await author.save()

    res.redirect('/authors/${author.id}')
  } catch {
    if(author == null){
      res.redirect('/')
    } else {

      res.render('authors/edit', {
      author: author,
      errorMessage: 'Error updating Patient'
    })

    }
  }
})

// deletes author
router.delete('/:id',async (req,res)=> {
  
  let author 
  try {
    author = await Author.findById(req.params.id)
    
    await  author.remove()
    res.redirect('/authors')

  } catch {
    if(author == null){
      res.redirect('/')
    } else {
        res.redirect('/authors/${author.id}')
    }

    }
  })

module.exports = router