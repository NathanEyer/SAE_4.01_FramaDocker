const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.API_PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'framadate',
  user: process.env.DB_USER || 'framauser',
  password: process.env.DB_PASSWORD || 'framapass',
});

// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à PostgreSQL réussie');
    release();
  }
});


// Routes API

// 1. CRÉER UN SONDAGE
app.post('/api/polls', async (req, res) => {
  try {
    const { title, description, admin_email, options } = req.body;
    
    // Validation basique
    if (!title || !admin_email || !options || options.length === 0) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Insérer le sondage
    const pollResult = await pool.query(
      'INSERT INTO polls (title, description, admin_email) VALUES ($1, $2, $3) RETURNING *',
      [title, description, admin_email]
    );
    
    const poll = pollResult.rows[0];

    // Insérer les options
    for (const option of options) {
      await pool.query(
        'INSERT INTO poll_options (poll_id, date_option) VALUES ($1, $2)',
        [poll.id, option]
      );
    }

    res.status(201).json({ 
      message: 'Sondage créé avec succès', 
      poll_id: poll.id 
    });

  } catch (error) {
    console.error('Erreur création sondage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 2. VOIR UN SONDAGE
app.get('/api/polls/:id', async (req, res) => {
  try {
    const pollId = req.params.id;

    // Récupérer le sondage
    const pollResult = await pool.query(
      'SELECT * FROM polls WHERE id = $1',
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sondage non trouvé' });
    }

    const poll = pollResult.rows[0];

    // Récupérer les options
    const optionsResult = await pool.query(
      'SELECT * FROM poll_options WHERE poll_id = $1 ORDER BY id',
      [pollId]
    );

    // Récupérer les votes
    const votesResult = await pool.query(
      `SELECT v.*, po.date_option 
       FROM votes v 
       JOIN poll_options po ON v.option_id = po.id 
       WHERE v.poll_id = $1`,
      [pollId]
    );

    res.json({
      poll: poll,
      options: optionsResult.rows,
      votes: votesResult.rows
    });

  } catch (error) {
    console.error('Erreur récupération sondage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 3. METTRE À JOUR UN SONDAGE (modifier titre/description)
app.put('/api/polls/:id', async (req, res) => {
  try {
    const pollId = req.params.id;
    const { title, description, admin_email } = req.body;

    // Vérifier que le sondage existe
    const checkResult = await pool.query(
      'SELECT admin_email FROM polls WHERE id = $1',
      [pollId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sondage non trouvé' });
    }

    // Vérification simple de l'admin (en production, utilisez une vraie auth)
    if (checkResult.rows[0].admin_email !== admin_email) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Mettre à jour
    await pool.query(
      'UPDATE polls SET title = $1, description = $2 WHERE id = $3',
      [title, description, pollId]
    );

    res.json({ message: 'Sondage mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur mise à jour sondage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 4. VOTER (bonus)
// app.post('/api/polls/:id/vote', async (req, res) => {
//   try {
//     const pollId = req.params.id;
//     const { participant_name, votes } = req.body;

//     // votes = [{ option_id: 1, vote: 'yes' }, { option_id: 2, vote: 'no' }]
    
//     for (const vote of votes) {
//       await pool.query(
//         'INSERT INTO votes (poll_id, participant_name, option_id, vote) VALUES ($1, $2, $3, $4)',
//         [pollId, participant_name, vote.option_id, vote.vote]
//       );
//     }

//     res.json({ message: 'Vote enregistré avec succès' });

//   } catch (error) {
//     console.error('Erreur vote:', error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });



// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API FramaDate fonctionnelle' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`API Backend démarrée sur le port ${port}`);
});