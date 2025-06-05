const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.static('frontend/public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/poll/:id', (req, res) => {
    res.render('index', { 
        title: 'Sondage - Framadate Clone',
        subtitle: 'Votez pour vos disponibilités'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});