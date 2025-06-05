const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});