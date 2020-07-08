const express = require('express')
const passport = require('passport')
const Quiz = require('../models/quiz')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /examples
router.get('/quizzes', requireToken, (req, res, next) => {
  Quiz.find({ owner: req.user.id })
    .populate('questions')
    .populate('results')
  // this needs to be reconfigured to find quizes belonging to classes students are in
  // Quiz.find({$or: [{owner: req.user.id}, {'classroom.student': req.user._id}]})
    .then(quizzes => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return quizzes.map(quiz => quiz.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(quizzes => res.status(200).json({ quizzes: quizzes }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/quizzes/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Quiz.findById(req.params.id)
    .populate('questions')
    .populate('results')
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(quiz => res.status(200).json({ quiz: quiz.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /questions
router.post('/quizzes', requireToken, (req, res, next) => {
  // set owner of new question to be current user
  req.body.quiz.owner = req.user.id

  Quiz.create(req.body.quiz)
    // respond to succesful `create` with status 201 and JSON of new "question"
    .then(quiz => {
      res.status(201).json({ quiz: quiz.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/quizzes/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.quiz.owner

  Quiz.findById(req.params.id)
    .then(handle404)
    .then(quiz => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, quiz)

      // pass the result of Mongoose's `.update` to the next `.then`
      return quiz.updateOne(req.body.quiz)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/quizzes/:id', requireToken, (req, res, next) => {
  Quiz.findById(req.params.id)
    .then(handle404)
    .then(quiz => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, quiz)
      // delete the example ONLY IF the above didn't throw
      quiz.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
