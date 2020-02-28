const path = require('path')
const express = require('express');
const jsonParser = express.json();
const xss = require('xss');
const notesService = require('./notes-service.js');
const notesRouter = express.Router()

const serializeNotes = note => ({
  id: note.id,
  name: xss(note.name),
  modified: note.modified,
  folderid: note.folderid,
  content: xss(note.content)
})

notesRouter
  .route('/')
  .get((req, res, next) => {
    notesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        console.log(notes)
        res.json(notes.map(serializeNotes))
      })
      .catch(next)
  })

module.exports = notesRouter