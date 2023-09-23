const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// require route handlers
const notesRoutes = require('./routes/notesRoutes');
const indexRoutes = require('./routes/indexRoutes');

app.use('/', indexRoutes);
app.use('/notes', notesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});