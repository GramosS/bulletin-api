const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

//  anslut till postgresql
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'projekt', 
  password: '',        
  port: 5432,
});

// test-route
app.get('/', (req, res) => {
  res.send('API fungerar! 🚀');
});

// skapa användare
app.post('/users', async (req, res) => {
  const { username, email } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fel vid skapande av användare' });
  }
});

// skapa kanal
app.post('/channels', async (req, res) => {
  const { name, owner_id } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO channels (name, owner_id) VALUES ($1, $2) RETURNING *',
      [name, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fel vid skapande av kanal' });
  }
});

// hämta kanaler en användare är medlem i
app.get('/users/:id/channels', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT c.*
      FROM channels c
      JOIN members m ON c.id = m.channel_id
      WHERE m.user_id = $1
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fel vid hämtning av kanaler' });
  }
});

// hämta alla meddelanden i en kanal
app.get('/channels/:id/messages', async (req, res) => {
  const channelId = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT posts.*, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE channel_id = $1
      ORDER BY posts.id ASC
      `,
      [channelId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fel vid hämtning av meddelanden' });
  }
});

// skapa meddelande om användaren är medlem
app.post('/messages', async (req, res) => {
  const { content, user_id, channel_id } = req.body;

  try {
    // kontrollera medlemskap
    const memberCheck = await pool.query(
      'SELECT * FROM members WHERE user_id = $1 AND channel_id = $2',
      [user_id, channel_id]
    );

    if (memberCheck.rowCount === 0) {
      return res.status(403).json({ error: 'Användaren är inte medlem i denna kanal' });
    }

    // skapa meddelande
    const result = await pool.query(
      'INSERT INTO posts (content, user_id, channel_id) VALUES ($1, $2, $3) RETURNING *',
      [content, user_id, channel_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fel vid postande av meddelande' });
  }
});

// starta servern
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
