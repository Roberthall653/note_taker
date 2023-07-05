const fs = require('fs')
const database = require('../db/db.json');
const router = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

const { v4: uuidv4 } = require('uuid');

router.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then
    ((data) => res.json(JSON.parse(data)))
    
});

router.post('/notes', (req, res) => {
    console.log(`${req.method} request recieved to add a note.`)
    const { title, text } = req.body;
    
    if (title && text) {
    const newNote = 
    {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text
    }

    readAndAppend(newNote, './db/db.json');

    const response = {
        status: 'success',
        body: newNote
    };

    console.log(response);
    res.status(201).json(response);
    } else {
     res.status(500).json('Error creating new note.')
    }
});

router.delete('/notes/:id', (req,res) =>{
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);

      writeToFile('./db/db.json', result);

      res.json(`Note ${noteId} was deleted`);
    });
})

module.exports = router