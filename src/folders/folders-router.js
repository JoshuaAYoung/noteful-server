const path = require('path')
const express = require('express');
const jsonParser = express.json();
const xss = require('xss');
const foldersService = require('./folders-service');
const foldersRouter = express.Router()

const serializeFolders = folder => ({
  id: folder.id,
  name: xss(folder.name),
})



foldersRouter
  .route('/')
  .get((req, res, next) => {
    foldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.status(200).json(folders.map(serializeFolders))
      })
      .catch(next)
  })

  .post((req, res, next) => {

    const { name } = req.body;

    if (!name) {
      return res
        .status(400).send('Folder name is required');
    }

    foldersService.insertFolder(req.app.get('db'), name)
      .then(result => {
        return res.status(201)
          .location(`/api/folders/${result.id}`)
          .json(result)
      })
      .catch(next)

  })


foldersRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params

    foldersService.getById(req.app.get('db'), id)
      .then(folder => {
        return res
          .json(folder)
      })
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    foldersService.deleteFolder(req.app.get('db'), id)
      .then(deleted => {
        res.status(204).end()
      })
      .catch(next)
  })













module.exports = foldersRouter