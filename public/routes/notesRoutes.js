const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from the 'uuid' module

router.get('/notes', (req, res) => {

});

router.post('/notes', (req, res) => {
 const newNote = req.body;
 newNote.id = uuidv4(); // Generate a unique ID
 fs.writeFileSync
});

router.delete('/notes/:id', (req, res) => {

});

module.exports = router;