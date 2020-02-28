const path = require('path')
const express = require('express');
const jsonParser = express.json();
const xss = require('xss');
const folderService = require('./folders-service.js');
const folderRouter = express.Router()

const serializeFolders = folder => ({
  id: folder.id,
  name: xss(folder.title),
})



folderRouter
  .route('/')
  .get((req, res, next) => {
    folderService.getAllFolders(req.app.get('db'))
      .then(folders => {
        console.log(folders)
        res.status(200).json(folders.map(serializeFolders))
      })
      .catch(next)
  })



module.exports = foldersRouter