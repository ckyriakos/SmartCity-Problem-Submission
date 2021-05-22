// Handles CRUD OPERATIONS ROUTING FOR PATIENS
const express = require('express')
const router = express.Router()
const Patient = require('../models/patient')
const Ehr = require('../models/ehr')
// All patients Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.amka != null && req.query.amka !== '') {
    searchOptions.amka = new RegExp(req.query.amka, 'i') // to search for part of a name
  }
  try {
    const patients = await Patient.find(searchOptions) //searchOptions is pretty much for find queries
    res.render('patients/index', {
      patients: patients,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New patient Route
router.get('/new', (req, res) => {
  res.render('patients/new', { patient: new Patient() })
})

// Create patient Route
router.post('/', async (req, res) => {
  const patient = new Patient({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    amka: req.body.amka,
    birthDate: req.body.birthDate
  })
  try {
    const newPatient = await patient.save()
    res.redirect("patients/${newPatient.id}")
  } catch {
    res.render('patients/new', {
      patient: patient,
      errorMessage: 'Error creating Patient'
    })
  }
})

// show patient
router.get('/:id', async (req,res)=> {
   try {
    const patient = await Patient.findById(req.params.id)
    const ehrs = await Ehr.find({ patient: patient.id }).limit(6).exec()
    res.render('patients/show', {
      patient: patient,
      ehrForPatient: ehrs
    })
  } catch {
    res.redirect('/')
  }
})

//  get edit patient
router.get('/:id/edit', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    res.render('patients/edit', { patient: patient })
  } catch {
    res.redirect('/patients')
  }
})

// updates patient
router.put('/:id', async (req,res)=> {
  
  let patient 
  try {
    patient = await Patient.findById(req.params.id)

    patient.firstName = req.body.firstName
    patient.lastName = req.body.lastName
    patient.amka = req.body.amka
    patient.birthDate = req.body.birthDate

    await patient.save()

    res.redirect('/patients/${patient.id}')
  } catch {
    if(patient == null){
      res.redirect('/')
    } else {

      res.render('patients/edit', {
      patient: patient,
      errorMessage: 'Error updating Patient'
    })

    }
  }
})

// deletes patient
router.delete('/:id',async (req,res)=> {
  
  let patient 
  try {
    patient = await Patient.findById(req.params.id)
    
    await  patient.remove()
    res.redirect('/patients')

  } catch {
    if(patient == null){
      res.redirect('/')
    } else {
        res.redirect('/patients/${patient.id}')
    }

    }
  })

module.exports = router