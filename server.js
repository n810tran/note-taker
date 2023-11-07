const { uuid } = require('uuidv4');
const express = require('express');
const path = require('path');
const fs = require('fs');

// Define port
const PORT = process.env.PORT || 3001;

// Initialize middleware
const app = express();

// Middleware for parsing JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static('public'));

// Serve index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

// API Routes
// GET /api/notes should read the db.json file and return all saved notes as JSON
app.get('/api/notes', async (req, res) => {
    try {
        // Read the db.json file and parse the data
        const savedNote = await fs.readFileSync('./db/db.json', 'utf8');
        const savedNoteParse = JSON.parse(savedNote);

        // Return the parsed data as JSON
        return res.json(savedNoteParse);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file and then return the new note to the client
// Give each note a unique id when it's saved from uuid npm package
app.post('/api/notes', async (req, res) => {
    try {
        // Destructure the items in req.body
        const { title, text } = req.body;

        // Check to see if required note properties are present
        if (title && text) {
            const newNote = {
                title,
                text,
                id: uuid(),
            };

            // Obtain existing notes
            const data = await fs.readFileSync('./db/db.json', 'utf8');
            const dataArray = JSON.parse(data);

            // Push new note
            dataArray.push(newNote);

            // Stringify notes array
            const noteString = JSON.stringify(dataArray, null, 2);

            // Write note string to db.json
            await fs.writeFileSync('./db/db.json', noteString);

            const response = {
                status: 'success',
                body: newNote,
            };

            return res.status(201).json(response);
        } else {
            return res.status(500).json('Error in posting note');
        }
    } catch (err) {
        return res.status(500).json(err);
    };
});

// DELETE ROUTE
// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. 
app.delete('/api/notes/:id', async (req, res) => {
    try {
        // In order to delete a note, you'll need to read all notes from the db.json file
        const savedNotes = await fs.readFileSync('./db/db.json', 'utf8');
        const savedNotesParse = JSON.parse(savedNotes);

        // Get the id of the note to delete from the request parameters
        const deletedID = req.params.id;

        // Use filter to remove the note with the given id property
        const updatedNotes = savedNotesParse.filter(note => note.id !== deletedID);

        // Stringify the updated notes array and write it to the db.json file
        const updatedNoteString = JSON.stringify(updatedNotes, null, 2);
        await fs.writeFileSync('./db/db.json', updatedNoteString);

        return res.json(updatedNotes);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// HTML Routes
// GET /notes should return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})
// GET * should return the index.html file
app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Listener
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);