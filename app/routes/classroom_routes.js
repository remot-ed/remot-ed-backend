// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')

// pull in classroom model for examples
const Classroom = require('../models/classroom')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /classrooms
router.get('/classrooms', requireToken, (req, res, next) => {
  console.log('whats student id?' + req.user._id)
  // find class where req.user._id is equal to owner or in students array (pause until populate is resolved)
  // Classroom.find({$or: [{owner: req.user.id}, {students: req.user._id}]})
  Classroom.find({owner: req.user.id})
    .populate('students')
    .populate('quizzes')
    .then(classrooms => {
      return classrooms.map(classroom => classroom.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(classrooms => res.status(200).json({ classrooms: classrooms }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/classrooms/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Classroom.findById(req.params.id)
    .populate('students')
    .populate('quizzes')
    // .populate('students')
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(classroom => res.status(200).json({ classroom: classroom.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /questions/5a7db6c74d55bc51bdf39793
router.get('/myclassrooms/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  const userId = req.user._id
  Classroom.find({ owner: userId })
    .populate('students')
    .then(classroom => {
      return classroom.map(classroom => classroom.toObject())
    })
    .then(handle404)
    .then(classrooms => res.status(200).json({ classrooms: classrooms }))

    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /questions
router.post('/classrooms', requireToken, (req, res, next) => {
  // set owner of new question to be current user
  req.body.classroom.owner = req.user.id

  Classroom.create(req.body.classroom)
    // respond to succesful `create` with status 201 and JSON of new "question"
    .then(classroom => {
      res.status(201).json({ classroom: classroom.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/classrooms/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.classroom.owner

  Classroom.findById(req.params.id)
    .then(handle404)
    .then(classroom => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, classroom)

      // pass the result of Mongoose's `.update` to the next `.then`
      return classroom.updateOne(req.body.classroom)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/classrooms/:id', requireToken, (req, res, next) => {
  Classroom.findById(req.params.id)
    .then(handle404)
    .then(classroom => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, classroom)
      // delete the example ONLY IF the above didn't throw
      classroom.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
