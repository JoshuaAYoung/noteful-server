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

  .post((req, res, next) => {
    const { name, modified, folderid, content } = req.body;
    const newNote = { name, modified, folderid, content }

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newNote.name = name;
    newNote.modified = modified;
    newNote.folderid = folderid;
    newNote.content = content;

    notesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(`/api/notes/${note.id}`)
          .json(serializeNotes(note))
      })
      .catch(next)
  })

notesRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params

    notesService.getById(req.app.get('db'), id)
      .then(note => {
        return res
          .json(note)
      })
  })

module.exports = notesRouter