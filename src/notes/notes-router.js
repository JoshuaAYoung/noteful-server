const path = require('path')
const express = require('express');
const jsonParser = express.json();
const xss = require('xss');
const notesService = require('./notes-service.js');
const noteRouter = express.Router()

const serializeNotes = note => ({
  id: note.id,
  name: note.name,
  modified: xss(note.modified),
  folder_id: xss(note.folder_id),
  content: note.content
})

noteRouter
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