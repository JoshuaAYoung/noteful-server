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
        console.log(folders)
        res.status(200).json(folders.map(serializeFolders))
      })
      .catch(next)
  })



module.exports = foldersRouter