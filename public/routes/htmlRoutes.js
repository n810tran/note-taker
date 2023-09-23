const express = require('express')
const router = express.Router();
const path = require('path');

// /notes endpoint will go to notes.html
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../notes.html'));
});

// any other endpoint will direct to index.html
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

module.exports = router;