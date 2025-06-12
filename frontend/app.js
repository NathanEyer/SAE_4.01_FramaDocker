const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static('frontend/public')); // pour CSS/JS séparés si besoin

// Route principale
app.get('/', (req, res) => {
    try{
        res.render('index', { 
            title: 'Framadate Clone',
            subtitle: 'Organisez vos événements facilement'
        });
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
});

// Route pour un sondage spécifique
app.get('/poll/:id', (req, res) => {
    res.render('index', { 
        title: 'Sondage - Framadate Clone',
        subtitle: 'Votez pour vos disponibilités'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});